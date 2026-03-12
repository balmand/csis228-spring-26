const DepartmentRepository = require("../repositories/department.repository");
const ClientRepository = require("../repositories/client.repository");
const DepartmentDto = require("../dtos/department.dto");

class DepartmentService {
    static async getAll() {
        const entities = await DepartmentRepository.findAll();
        return DepartmentDto.toListDto(entities);
    }

    /** Returns raw entities for internal use (e.g. depPer). */
    static async _getAllEntities() {
        return await DepartmentRepository.findAll();
    }

    static async getById(id) {
        const entity = await DepartmentRepository.findById(id);
        if (!entity) {
            throw new Error("Department not found");
        }
        return DepartmentDto.toResponseDto(entity);
    }

    static async create(body) {
        if (!body.name || !body.location) {
            throw new Error("Name and location are required");
        }
        const data = DepartmentDto.fromCreateRequest(body);
        const entity = await DepartmentRepository.create(data);
        return DepartmentDto.toResponseDto(entity);
    }

    static async update(id, body) {
        if (!id || !body.name || !body.location) {
            throw new Error("ID, name and location are required");
        }
        const data = DepartmentDto.fromUpdateRequest(body);
        const entity = await DepartmentRepository.update(id, data);
        if (!entity) {
            throw new Error("Department not found");
        }
        return DepartmentDto.toResponseDto(entity);
    }

    static async delete(id) {
        if (!id) {
            throw new Error("ID is required");
        }
        const entity = await DepartmentRepository.findById(id);
        if (!entity) {
            throw new Error("Department not found");
        }
        await DepartmentRepository.deleteById(id);
    }

    static async departmentsClients() {
        const rows = await DepartmentRepository.findDepartmentClients();
        if (!rows) {
            throw new Error("Data not found");
        }
        return rows;
    }

    static async depPer() {
        const deps = await this._getAllEntities();
        const clientEntities = await ClientRepository.findAll();
        let itIndex = 0;
        let salesIndex = 0;
        let hrIndex = 0;

        for (const dep of deps) {
            for (const client of clientEntities) {
                if (client.dep_id === dep.dep_id) {
                    switch ((dep.dep_name || "").toLowerCase()) {
                        case "sales": salesIndex++; break;
                        case "it": itIndex++; break;
                        case "hr": hrIndex++;
                    }
                }
            }
        }

        const total = clientEntities.length || 1;
        return {
            Sales: (salesIndex / total) * 100,
            IT: (itIndex / total) * 100,
            HR: (hrIndex / total) * 100,
        };

    }

}

module.exports = DepartmentService;