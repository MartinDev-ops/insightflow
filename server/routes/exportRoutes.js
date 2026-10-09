const express = require("express");

const router = express.Router();

const { requireVisitor } = require("../middleware/visitorAuth");
const { apiLimiter } = require("../middleware/rateLimit");

const {

    exportWorkbook

} = require("../controllers/exportController");

router.get("/:projectId", apiLimiter, requireVisitor, exportWorkbook);

module.exports = router;