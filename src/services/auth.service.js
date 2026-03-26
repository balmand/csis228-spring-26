const { generateToken } = require("../utils/token");
const bcrypt = require("bcryptjs");
const { normalizeRoles, resolvePermissionsForRoles } = require("../auth/roleManager");

class AuthService {
    static async login({ username, password, email } = {}) {
        // Backwards-compatible input: allow either {username,password} or {email,password}
        const subject = username || email;

        if (!subject || !password) {
            throw new Error("Username/email and password are required");
        }

        // Default "admin" user is configured via env. This keeps the project runnable
        // without requiring DB-backed user management.
        const expectedUsername = process.env.AUTH_USERNAME || "admin";

        // Prefer a pre-hashed password if provided; otherwise hash the plain env password once.
        const expectedPasswordHash =
            process.env.AUTH_PASSWORD_HASH ||
            bcrypt.hashSync(process.env.AUTH_PASSWORD || "password123", 10);

        const isUsernameMatch = String(subject) === String(expectedUsername);
        const isPasswordMatch = await bcrypt.compare(String(password), expectedPasswordHash);

        if (!isUsernameMatch || !isPasswordMatch) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        }

        const roles = normalizeRoles(process.env.AUTH_ROLES || "admin");
        const permissions = resolvePermissionsForRoles(roles);

        const token = generateToken({
            sub: subject,
            roles,
            permissions,
        });

        return { token };
    }
}

module.exports = AuthService;
