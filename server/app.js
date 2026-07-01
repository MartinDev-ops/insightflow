const express = require("express");
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const pool = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/projects", projectRoutes);

const upload = multer({ dest: "uploads/" });

let dataset = [];


app.post("/upload", upload.array("files"), (req, res) => {
    try {
        let allData = [];

        req.files.forEach(file => {
            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            allData = allData.concat(jsonData);
        });

        dataset = allData;

        res.json({
            message: "Files uploaded successfully",
            totalRows: dataset.length,
            preview: dataset.slice(0, 10)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/data", (req, res) => {
    res.json({
        totalRows: dataset.length,
        preview: dataset.slice(0, 20)
    });
});

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("✅ PostgreSQL Connected!");
        console.log("Current Database Time:", result.rows[0].now);
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});