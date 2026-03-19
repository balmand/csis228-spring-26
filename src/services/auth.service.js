const ClientRepository = require("../repositories/client.repository");
const { generateToken } = require("../utils/token");

class AuthService {
    static async login ({ email, password }) {

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const expectedClient = await ClientRepository.authenticate(email, password);

        if (!expectedClient) {
            throw new Error("Invalid Credentials")
        }

        const token = generateToken({sub: email});

        return {
            token,
        };
    }
}

module.exports = AuthService;
