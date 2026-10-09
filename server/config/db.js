require("dotenv").config();

const { Pool } = require("pg");

const { IS_PRODUCTION } = require("./env");

/**
 * Pool options.
 *
 * TLS: managed Postgres (Supabase/RDS/Neon) requires TLS, so encryption stays
 * on. Certificate verification is enabled in production — disabling it
 * (`rejectUnauthorized: false`) allowed any on-path attacker to MITM the
 * database connection. In local development against a self-hosted or local
 * Postgres there is no certificate to verify, so it is relaxed there only.
 */
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: IS_PRODUCTION
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

// A pooled client that errors (server restart, network blip) would otherwise
// take down whichever request happened to be holding it.
pool.on("error", (error) => {

    console.error("Unexpected error on idle Postgres client:", error.message);

});

module.exports = pool;