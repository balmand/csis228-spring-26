require("dotenv").config();

const { Pool } = require("pg");

let poolInstance = null;

function getFirstEnvValue(...keys) {
    for (const key of keys) {
        const value = process.env[key];
        if (typeof value === "string" && value.trim() !== "") {
            return value;
        }
    }
    return undefined;
}

function getPoolConfig() {
    const user = getFirstEnvValue("PG_USER", "POSTGRES_USER");
    const password = getFirstEnvValue("PG_PASS", "PG_PASSWORD", "POSTGRES_PASSWORD");
    const host = getFirstEnvValue("PG_HOST", "POSTGRES_HOST") || "localhost";
    const database = getFirstEnvValue("PG_DATABASE", "POSTGRES_DB");
    const port = Number(getFirstEnvValue("PG_PORT", "POSTGRES_PORT") || 5432);

    const missingKeys = [];

    if (!user) {
        missingKeys.push("PG_USER");
    }

    if (!database) {
        missingKeys.push("PG_DATABASE");
    }

    if (!password) {
        missingKeys.push("PG_PASS or PG_PASSWORD");
    }

    if (missingKeys.length) {
        throw new Error(
            `Database configuration is incomplete. Set ${missingKeys.join(", ")} in .env before loading database-backed routes.`
        );
    }

    return {
        user,
        password,
        host,
        database,
        port,
    };
}

function getPool() {
    if (!poolInstance) {
        poolInstance = new Pool(getPoolConfig());
    }

    return poolInstance;
}

module.exports = {
    query(text, params) {
        return getPool().query(text, params);
    },
};
