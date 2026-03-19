const { generateToken } = require("../utils/token");

class AuthService {
    static login({ username, password }) {
        const expectedUsername = process.env.AUTH_USERNAME || "admin";
        const expectedPassword = process.env.AUTH_PASSWORD || "password123";

        if (!username || !password) {
            throw new Error("Username and password are required");
        }

        if (username !== expectedUsername || password !== expectedPassword) {
            throw new Error("Invalid credentials");
        }

        return {
            token: generateToken({ sub: username }),
        };
    }
}

module.exports = AuthService;
