const rateLimit = require("express-rate-limit");

/**
 * Rate limiters.
 *
 * The AI limiter is deliberately strict: every request spends Gemini tokens, so
 * an unauthenticated flood is a direct cost. Limits are per-IP because visitor
 * identity is established per request.
 *
 * `standardHeaders: "draft-7"` + `legacyHeaders: false` keeps the response
 * free of deprecated X-RateLimit headers.
 */

function build({ windowMs, limit, message }) {

    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        message: { message }
    });

}

// AI calls hit a paid external API.
const aiLimiter = build({
    windowMs: 60 * 1000,
    limit: 20,
    message: "AI request limit reached. Wait a moment and try again."
});

// Workbook cleaning is CPU- and memory-heavy.
const cleanLimiter = build({
    windowMs: 60 * 1000,
    limit: 30,
    message: "Too many clean operations. Wait a moment and try again."
});

// Uploads write to disk and are parsed by ExcelJS.
const uploadLimiter = build({
    windowMs: 60 * 1000,
    limit: 20,
    message: "Too many uploads. Wait a moment and try again."
});

// General safety net for reads.
const apiLimiter = build({
    windowMs: 60 * 1000,
    limit: 300,
    message: "Too many requests. Wait a moment and try again."
});

module.exports = {
    aiLimiter,
    cleanLimiter,
    uploadLimiter,
    apiLimiter
};