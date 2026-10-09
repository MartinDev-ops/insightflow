require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");
const ExcelJS = require("exceljs");

const pool = require("./config/db");

const {
    PORT,
    CORS_ORIGINS,
    UPLOAD_MAX_BYTES,
    IS_PRODUCTION
} = require("./config/env");

const { requireVisitor } = require("./middleware/visitorAuth");
const { uploadLimiter } = require("./middleware/rateLimit");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const workbookRoutes = require("./routes/workbookRoutes");
const exportRoutes = require("./routes/exportRoutes");
const cleanRoutes = require("./routes/cleanRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Trust the first proxy hop so rate limiting sees real client IPs when deployed
// behind a load balancer / platform router (Render, Fly, Railway, nginx).
app.set("trust proxy", 1);

// Baseline security headers. The API serves JSON and file downloads only, so the
// default CSP does not apply, but HSTS / nosniff / frame-options all matter.
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" }
}));

// =========================
// CORS
// =========================

// Previously `cors()` reflected any origin, which let any site make
// authenticated-looking calls to the API from a visitor's browser.
// Production must list explicit origins; development falls back to reflecting.
app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

// Cap JSON body size. Workbooks are large, so this is generous but still bounded.
app.use(express.json({ limit: "50mb" }));

// =========================
// Health check (used by the keep-alive ping)
// =========================

app.get("/health", (req, res) => {
    res.sendStatus(200);
});

// =========================
// Auth
// =========================

// Issues the signed visitor token that identifies project ownership.
app.use("/auth", authRoutes);

// =========================
// Routes
// =========================

app.use("/projects", projectRoutes);
app.use("/workbooks", workbookRoutes);
app.use("/export", exportRoutes);
app.use("/clean", cleanRoutes);
app.use("/ai", aiRoutes);

// =========================
// File Upload
// =========================

const ALLOWED_UPLOAD_EXTENSIONS = new Set([".xlsx", ".xls", ".xlsm", ".csv"]);

/**
 * Multer is bounded on both size and type.
 *
 * Previously `multer({ dest: "uploads/" })` accepted any file of any size, so a
 * single request could fill the disk with arbitrary content.
 */
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: UPLOAD_MAX_BYTES,
        files: 10
    },
    fileFilter: (req, file, cb) => {

        const extension = require("path")
            .extname(file.originalname || "")
            .toLowerCase();

        if (!ALLOWED_UPLOAD_EXTENSIONS.has(extension)) {

            return cb(
                new Error(
                    `Unsupported file type "${extension || "unknown"}". ` +
                    "Allowed: .xlsx, .xls, .xlsm, .csv"
                )
            );

        }

        cb(null, true);

    }
});

/**
 * In-memory dataset, keyed by visitor.
 *
 * Previously a single module-level `dataset` was shared by every caller, so one
 * user's upload silently replaced another's. Keying by verified visitor id
 * isolates visitors, and a bounded LRU prevents unbounded growth from uploads
 * that are never saved to the database.
 */
const MAX_DATASET_ENTRIES = 20;

const datasetStore = new Map();

function setDatasetForVisitor(visitorId, data) {

    // Refresh recency so the least-recently-used entry is the one evicted.
    if (datasetStore.has(visitorId)) {

        datasetStore.delete(visitorId);

    }

    datasetStore.set(visitorId, data);

    while (datasetStore.size > MAX_DATASET_ENTRIES) {

        const oldestKey = datasetStore.keys().next().value;

        datasetStore.delete(oldestKey);

    }

}

function getDatasetForVisitor(visitorId) {

    return datasetStore.get(visitorId) || null;

}

// =========================
// Helpers
// =========================

// Mirrors ExcelJS's own serial <-> Date math (utils.dateToExcel) so that
// converting a Date back to a serial number is a lossless round trip and
// stays in sync with the cell's numFmt (currency/date/percent patterns
// only render correctly against numeric serials, not Date/ISO strings).
function dateToExcelSerial(date, date1904) {

    return 25569 + (date.getTime() / (24 * 3600 * 1000)) - (date1904 ? 1462 : 0);

}

// =========================
// Upload Excel Workbook
// =========================

app.post("/upload", uploadLimiter, requireVisitor, upload.array("files"), async (req, res) => {

    const uploadedPath = req.files?.[0]?.path;

    try {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                message: "No Excel file uploaded."
            });

        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(uploadedPath);

        const date1904 = workbook.properties?.date1904 || false;

        const workbookData = [];

        workbook.eachSheet((worksheet) => {

            const rows = [];
            const columns = [];
            const merges = [];

            worksheet.columns.forEach((column) => {

                columns.push({
                    width: column.width || 10
                });

            });

            Object.keys(worksheet._merges).forEach((merge) => {

                merges.push(merge);

            });

            worksheet.eachRow({ includeEmpty: true }, (row) => {

                const cells = [];

                row.eachCell({ includeEmpty: true }, (cell) => {

                    let value = cell.value;

                    if (value instanceof Date) {

                        value = dateToExcelSerial(value, date1904);

                    }

                    cells.push({
                        value,
                        style: cell.style,
                        numFmt: cell.numFmt,
                        font: cell.font,
                        fill: cell.fill,
                        border: cell.border,
                        alignment: cell.alignment
                    });

                });

                rows.push({
                    height: row.height,
                    cells
                });

            });

            workbookData.push({
                name: worksheet.name,
                rowCount: worksheet.rowCount,
                columnCount: worksheet.columnCount,
                columns,
                merges,
                rows
            });

        });

        // Store against the verified visitor so concurrent users do not
        // overwrite each other's in-memory import.
        setDatasetForVisitor(req.visitorId, workbookData);

        console.log("\u2705 Workbook imported with ExcelJS");

        res.json({
            message: "Workbook imported successfully",
            workbook: workbookData
        });

    }

    catch (error) {

        console.error("\u274C Upload Error:", error.message);

        // Multer's own limit/filter errors carry a user-actionable message and
        // should surface as a 4xx, not a 500.
        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(413).json({
                message: `File too large. Maximum size is ${
                    Math.round(UPLOAD_MAX_BYTES / (1024 * 1024))
                }MB.`
            });

        }

        if (error instanceof multer.MulterError) {

            return res.status(400).json({
                message: error.message
            });

        }

        res.status(500).json({
            error: "Failed to process upload."
        });

    }

    finally {

        // Multer's temp file is no longer needed once the workbook is parsed,
        // or when parsing failed. Without this, uploads/ fills up over time.
        if (uploadedPath) {

            require("fs").unlink(uploadedPath, () => {});

        }

    }

});

// =========================
// Debug Endpoint
// =========================

/**
 * Returns the calling visitor's in-memory import.
 *
 * Previously this returned one shared dataset to anyone, unauthenticated —
 * a direct data leak. It now requires a valid token and only ever returns that
 * visitor's own workbook. Disabled entirely in production.
 */
app.get("/data", requireVisitor, (req, res) => {

    if (IS_PRODUCTION) {

        return res.status(404).json({
            message: "Not found."
        });

    }

    res.json(getDatasetForVisitor(req.visitorId) || []);

});

// =========================
// PostgreSQL Test
// =========================

pool.query("SELECT NOW()", (err) => {

    if (err) {

        console.error("\u274C Database connection failed:", err.message);

    }

    else {

        console.log("\u2705 PostgreSQL Connected!");

    }

});

// =========================
// Start Server
// =========================

// Exported so tests and tooling can mount the app without opening a socket.
module.exports = app;

// Only bind a port when run directly, not when imported by a test harness.
if (require.main === module) {

    startServer();

}

/**
 * Starts the HTTP listener and wires graceful shutdown.
 */
function startServer() {

    const server = app.listen(PORT, () => {

        console.log("\u{1F680} InsightFlow Backend Started");

        console.log(
            `\u{1F310} Server : ${
                IS_PRODUCTION ? "production" : "development"
            } mode on port ${PORT}`
        );

    });

    /**
     * Close the HTTP server and drain the Postgres pool before exiting, so
     * rolling deploys do not drop in-flight requests or leak connections.
     */
    function shutdown(signal) {

        console.log(`\n${signal} received, shutting down gracefully...`);

        server.close(() => {

            pool.end()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));

        });

        // Do not hang forever if a connection refuses to close.
        setTimeout(() => process.exit(1), 10000).unref();

    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // A rejection with no handler would otherwise be an unhandled rejection and
    // take the process down without a useful log line.
    process.on("unhandledRejection", (reason) => {

        console.error("Unhandled promise rejection:", reason);

    });

    return server;

}