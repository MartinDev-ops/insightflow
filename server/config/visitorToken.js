const crypto = require("crypto");

const { VISITOR_SECRET } = require("./env");

/**
 * Signs and verifies visitor tokens.
 *
 * A visitor id is the identity that owns a project (`projects.owner_id`). It
 * used to be sent as a bare `X-Visitor-Id` header, which any caller could
 * choose, so one visitor could read or overwrite another's data by guessing or
 * observing the header. Tokens are now `<uuid>.<hmac>` so the server can prove
 * it issued the id itself.
 */

/**
 * Signs a visitor id.
 *
 * @param {string} visitorId
 * @returns {string} `<uuid>.<hmac-hex>`
 */
function signVisitorId(visitorId) {

    const signature = crypto
        .createHmac("sha256", VISITOR_SECRET)
        .update(visitorId)
        .digest("hex");

    return `${visitorId}.${signature}`;

}

/**
 * Verifies a signed visitor token.
 *
 * @param {string} token
 * @returns {string|null} the visitor id, or null if the token is malformed or
 *   the signature does not match.
 */
function verifyVisitorToken(token) {

    if (typeof token !== "string" || !token) {

        return null;

    }

    const separator = token.lastIndexOf(".");

    if (separator <= 0) {

        return null;

    }

    const visitorId = token.slice(0, separator);
    const providedSignature = token.slice(separator + 1);

    const expectedSignature = crypto
        .createHmac("sha256", VISITOR_SECRET)
        .update(visitorId)
        .digest("hex");

    // Compare as bytes with a fixed-length guard. timingSafeEqual throws on a
    // length mismatch, and a plain string compare would leak the signature.
    const provided = Buffer.from(providedSignature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
        provided.length !== expected.length ||
        !crypto.timingSafeEqual(provided, expected)
    ) {

        return null;

    }

    return visitorId;

}

module.exports = {
    signVisitorId,
    verifyVisitorToken
};