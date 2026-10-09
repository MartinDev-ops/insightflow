const express = require("express");

const router = express.Router();

const { requireVisitor } = require("../middleware/visitorAuth");
const { apiLimiter } = require("../middleware/rateLimit");

const {
    getWorkbook,
    saveWorkbook
} = require("../controllers/workbookController");

router.use(apiLimiter, requireVisitor);

// Get workbook for a project
router.get("/:projectId", getWorkbook);

// Save workbook
router.put("/:projectId", saveWorkbook);

module.exports = router;