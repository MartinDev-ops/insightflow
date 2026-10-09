const { verifyVisitorToken } = require("../config/visitorToken");

/**
 * Express middleware: requires a valid signed visitor token.
 *
 * Attaches `req.visitorId` so controllers can read the owner id without
 * re-verifying. Responds 401/403 rather than throwing, and keeps the raw token
 * out of responses and logs.
 */
function requireVisitor(req, res, next) {

    const token = req.header("x-visitor-token");

    if (!token) {

        return res.status(401).json({
            message: "Missing visitor token. Call POST /auth/visitor first."
        });

    }

    const visitorId = verifyVisitorToken(token);

    if (!visitorId) {

        return res.status(403).json({
            message: "Invalid or tampered visitor token."
        });

    }

    req.visitorId = visitorId;

    next();

}

module.exports = { requireVisitor };