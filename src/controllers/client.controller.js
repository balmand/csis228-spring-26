const ClientService = require("../services/client.service");

function handleError(res, err) {
    if (err.message?.toLowerCase().includes("not found")) return res.status(404).json({ error: err.message });
    if (err.message?.includes("required")) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: err.message });
}

class ClientController {
    static async getAll(req, res) {
        try {
            const clients = await ClientService.getAllClients();
            res.json(clients);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const client = await ClientService.getClientById(req.params.id);
            res.json(client);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async create(req, res) {
        try {
            const client = await ClientService.createClient(req.body);
            res.status(201).json(client);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async update(req, res) {
        try {
            const client = await ClientService.updateClient(req.params.id, req.body);
            res.status(200).json(client);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async delete(req, res) {
        try {
            await ClientService.deleteClient(req.params.id);
            res.json({ message: "Client deleted" });
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async getAllWithDepartments(req, res) {
        try {
            const clients = await ClientService.getAllClientsWithDepartments();
            res.json(clients);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getTest(req, res) {
        res.status(200).json("Hello from test");
    }
}

module.exports = ClientController;