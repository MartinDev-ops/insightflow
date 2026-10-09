require("dotenv").config();

const crypto = require("crypto");

/**
 * Environment configuration with validation.
 *
 * Fail fast and loudly at boot rather than crashing at the first request that
 * happens to touch a missing variable.
 */

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function required(name) {

    const value = process.env[name];

    if (!value || !value.trim()) {

        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `See .env.example for the full list.`
        );

    }

    return value;

}

const VISITOR_SECRET = required("VISITOR_SECRET");

// A weak signing secret would allow visitor IDs to be forged, so refuse short ones.
if (IS_PRODUCTION && VISITOR_SECRET.length < 32) {

    throw new Error(
        "VISITOR_SECRET must be at least 32 characters in production. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );

}

// Comma-separated allowlist. Empty in dev => any origin (so `npm start` works locally).
function parseOrigins() {

    const raw = process.env.CORS_ORIGINS || "";

    const list = raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    if (!IS_PRODUCTION && list.length === 0) {

        return true; // reflect any origin in development

    }

    if (list.length === 0) {

        throw new Error(
            "CORS_ORIGINS must be set in production (comma-separated allowed origins)."
        );

    }

    return list;

}

module.exports = {
    IS_PRODUCTION,
    PORT: Number(process.env.PORT) || 5001,
    VISITOR_SECRET,
    CORS_ORIGINS: parseOrigins(),
    DATABASE_URL: required("DATABASE_URL"),
    GEMINI_API_KEY: required("GEMINI_API_KEY"),
    UPLOAD_MAX_BYTES: Number(process.env.UPLOAD_MAX_BYTES) || 25 * 1024 * 1024
};
