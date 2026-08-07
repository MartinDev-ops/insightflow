function getVisitorId(req) {
    return req.header("x-visitor-id") || null;
}

module.exports = { getVisitorId };
