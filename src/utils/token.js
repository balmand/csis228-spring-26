const jwt = require("jsonwebtoken");

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60;

function getSecret() {
    return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function getExpiresInSeconds() {
    const parsed = Number(process.env.AUTH_TOKEN_TTL_SECONDS);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TOKEN_TTL_SECONDS;
}

function generateToken(payload, options = {}) {
    return jwt.sign(payload, getSecret(), {
        algorithm: "HS256",
        expiresIn: getExpiresInSeconds(),
        ...options,
    });
}

function verifyToken(token, options = {}) {
    try {
        return jwt.verify(token, getSecret(), {
            algorithms: ["HS256"],
            ...options,
        });
    } catch (err) {
        // Normalize jsonwebtoken errors to keep API responses stable.
        if (err && (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")) {
            throw new Error(err.message);
        }
        throw err;
    }
}

module.exports = { generateToken, verifyToken };
