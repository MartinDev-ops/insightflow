const express = require("express");

const router = express.Router();

const {
    getWorkbook,
    saveWorkbook
} = require("../controllers/workbookController");

// Get workbook for a project
router.get("/:projectId", getWorkbook);

// Save workbook
router.put("/:projectId", saveWorkbook);

module.exports = router;