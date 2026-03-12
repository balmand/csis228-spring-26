const DepartmentService = require("../services/department.service");

function handleError(res, err) {
    if (err.message?.toLowerCase().includes("not found")) return res.status(404).json({ error: err.message });
    if (err.message?.includes("required")) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: err.message });
}

class DepartmentController {
    static async getAll(req, res) {
        try {
            const departments = await DepartmentService.getAll();
            res.json(departments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const department = await DepartmentService.getById(req.params.id);
            res.json(department);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async create(req, res) {
        try {
            const dep = await DepartmentService.create(req.body);
            res.status(201).json(dep);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async update(req, res) {
        try {
            const dep = await DepartmentService.update(req.params.id, req.body);
            res.status(200).json(dep);
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async delete(req, res) {
        try {
            await DepartmentService.delete(req.params.id);
            res.json({ message: "Department deleted" });
        } catch (err) {
            return handleError(res, err);
        }
    }

    static async getDepsWithEmps(req, res) {
        try {
            const deps = await DepartmentService.departmentsClients();
            res.json(deps);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getDepPerc(req, res) {
        try {
            const result = await DepartmentService.depPer();
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = DepartmentController;