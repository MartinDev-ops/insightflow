const express = require("express");

const router = express.Router();

const { requireVisitor } = require("../middleware/visitorAuth");
const { cleanLimiter } = require("../middleware/rateLimit");

const {
    cleanWorkbook
} = require("../controllers/cleanController");

router.post("/", cleanLimiter, requireVisitor, cleanWorkbook);

module.exports = router;