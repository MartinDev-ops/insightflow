require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ExcelJS = require("exceljs");

const pool = require("./config/db");

const projectRoutes = require("./routes/projectRoutes");
const workbookRoutes = require("./routes/workbookRoutes");
const exportRoutes = require("./routes/exportRoutes");
const cleanRoutes = require("./routes/cleanRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

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

const upload = multer({
    dest: "uploads/"
});

let dataset = [];

// =========================
// Upload Excel Workbook
// =========================

app.post("/upload", upload.array("files"), async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                message: "No Excel file uploaded."
            });

        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(req.files[0].path);

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

                    cells.push({
                        value: cell.value,
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

        dataset = workbookData;

        console.log("✅ Workbook imported with ExcelJS");

        res.json({
            message: "Workbook imported successfully",
            workbook: workbookData
        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

// =========================
// Debug Endpoint
// =========================

app.get("/data", (req, res) => {

    res.json(dataset);

});

// =========================
// PostgreSQL Test
// =========================

pool.query("SELECT NOW()", (err, result) => {

    if (err) {

        console.error("Database connection failed:", err);

    }

    else {

        console.log("✅ PostgreSQL Connected!");
        console.log(result.rows[0].now);

    }

});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});