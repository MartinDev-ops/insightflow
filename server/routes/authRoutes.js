const express = require("express");

const router = express.Router();

const rateLimit = require("express-rate-limit");

const { issueVisitorToken } = require("../utils/visitor");

/**
 * POST /auth/visitor
 *
 * Issues a fresh signed visitor token. The client calls this on startup and
 * stores the token, then sends it as `X-Visitor-Token` on every request.
 *
 * Rate limited so token minting cannot be used to exhaust memory/DB connections.
 */
const issueLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "Too many tokens issued. Try again shortly."
    }
});

router.post("/visitor", issueLimiter, (req, res) => {

    const { visitorId, token } = issueVisitorToken();

    res.json({ visitorId, token });

});

module.exports = router;