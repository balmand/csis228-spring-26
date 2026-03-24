const ClientRepository = require("../repositories/client.repository");
const ClientDto = require("../dtos/client.dto");

class ClientService {
    static async getAllClients(filters = {}) {
        const normalizedFilters = ClientService.normalizeFilters(filters);
        const entities = await ClientRepository.findAll(normalizedFilters);
        return ClientDto.toListDto(entities);
    }

    static async getClientById(id) {
        const entity = await ClientRepository.findById(id);
        if (!entity) {
            throw new Error("Client not found");
        }
        return ClientDto.toResponseDto(entity);
    }

    static async createClient(body) {
        if (!body.name || !body.email) {
            throw new Error("Name and email are required");
        }
        const data = ClientDto.fromCreateRequest(body);
        const entity = await ClientRepository.create(data);
        return ClientDto.toResponseDto(entity);
    }

    static async updateClient(id, body) {
        if (!id || !body.name || !body.email) {
            throw new Error("ID, name and email are required");
        }
        const data = ClientDto.fromUpdateRequest(body);
        const entity = await ClientRepository.update(id, data);
        if (!entity) {
            throw new Error("Client not found");
        }
        return ClientDto.toResponseDto(entity);
    }

    static async deleteClient(id) {
        if (!id) {
            throw new Error("ID is required");
        }
        const entity = await ClientRepository.findById(id);
        if (!entity) {
            throw new Error("Client not found");
        }
        await ClientRepository.deleteById(id);
    }

    static async getAllClientsWithDepartments() {
        const entities = await ClientRepository.findAllWithDepartments();
        return ClientDto.toListWithDepartmentDto(entities);
    }

    static normalizeFilters(filters = {}) {
        const normalizedFilters = {};

        if (typeof filters.name === "string" && filters.name.trim()) {
            normalizedFilters.name = filters.name.trim();
        }

        if (typeof filters.email === "string" && filters.email.trim()) {
            normalizedFilters.email = filters.email.trim();
        }

        return normalizedFilters;
    }
}

module.exports = ClientService;
