const { signVisitorId } = require("../config/visitorToken");

const crypto = require("crypto");

/**
 * Issues a signed visitor token.
 *
 * Projects are keyed by `owner_id`, so the visitor id IS the identity that owns
 * the data. The server generates the id here rather than accepting one from the
 * client, so a caller cannot choose (and therefore guess) another visitor's id.
 */
function issueVisitorToken() {

    const visitorId = crypto.randomUUID();

    return {
        visitorId,
        token: signVisitorId(visitorId)
    };

}

/**
 * Reads the verified visitor id set by `requireVisitor` after it validated the
 * token signature. Returns null if the route was not protected.
 */
function getVisitorId(req) {

    return req.visitorId || null;

}

module.exports = {
    getVisitorId,
    issueVisitorToken
};
