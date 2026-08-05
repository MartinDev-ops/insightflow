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
// Health check (used by the keep-alive ping)
// =========================

app.get("/health", (req, res) => {
    res.sendStatus(200);
});

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

app.post("/upload", upload.array("files"), async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                message: "No Excel file uploaded."
            });

        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(req.files[0].path);

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

        dataset = workbookData;

        console.log("\u2705 Workbook imported with ExcelJS");

        res.json({
            message: "Workbook imported successfully",
            workbook: workbookData
        });

    }

    catch (error) {

        console.error("\u274C Upload Error:", error);

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

        console.error("\u274C Database connection failed:", err);

    }

    else {

        console.log("\u2705 PostgreSQL Connected!");
      
    }

});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

   
    console.log("\u{1F680} InsightFlow Backend Started");
    console.log(`\u{1F310} Server : http://localhost:${PORT}`);
  
    

});