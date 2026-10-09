const express = require("express");

const router = express.Router();

const { requireVisitor } = require("../middleware/visitorAuth");
const { aiLimiter } = require("../middleware/rateLimit");

const {

    askAI

} = require("../controllers/aiController");

// Strictest limiter in the app: each call spends Gemini tokens.
router.post("/", aiLimiter, requireVisitor, askAI);

module.exports = router;