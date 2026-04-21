const ClientService = require("../services/client.service");
const DepartmentService = require("../services/department.service");

function buildFeedbackState(req) {
    return {
        message: req.query.message || null,
        messageType: req.query.type === "error" ? "error" : "success",
    };
}

function buildRedirectPath(basePath, message, type = "success") {
    const params = new URLSearchParams({ message, type });
    return `${basePath}?${params.toString()}`;
}

class ViewController {
    static async renderHome(req, res) {
        try {
            const [clients, departments, clientsWithDepartments] = await Promise.all([
                ClientService.getAllClients(),
                DepartmentService.getAll(),
                ClientService.getAllClientsWithDepartments(),
            ]);

            return res.render("index", {
                title: "Project Views",
                summary: {
                    clients: clients.length,
                    departments: departments.length,
                    assignedClients: clientsWithDepartments.filter((client) => client.department).length,
                },
                error: null,
            });
        } catch (err) {
            return res.status(500).render("index", {
                title: "Project Views",
                summary: { clients: 0, departments: 0, assignedClients: 0 },
                error: err.message,
            });
        }
    }

    static async renderClients(req, res) {
        try {
            const clients = await ClientService.getAllClientsWithDepartments();
            return res.render("clients", {
                title: "Clients View",
                clients,
                error: null,
                ...buildFeedbackState(req),
            });
        } catch (err) {
            return res.status(500).render("clients", {
                title: "Clients View",
                clients: [],
                error: err.message,
                ...buildFeedbackState(req),
            });
        }
    }

    static async createClient(req, res) {
        try {
            await ClientService.createClient(req.body);
            return res.redirect(buildRedirectPath("/views/clients", "Client created successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/clients", err.message, "error"));
        }
    }

    static async updateClient(req, res) {
        try {
            await ClientService.updateClient(req.params.id, req.body);
            return res.redirect(buildRedirectPath("/views/clients", "Client updated successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/clients", err.message, "error"));
        }
    }

    static async deleteClient(req, res) {
        try {
            await ClientService.deleteClient(req.params.id);
            return res.redirect(buildRedirectPath("/views/clients", "Client deleted successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/clients", err.message, "error"));
        }
    }

    static async renderDepartments(req, res) {
        try {
            const [departments, percentages] = await Promise.all([
                DepartmentService.getAll(),
                DepartmentService.depPer(),
            ]);

            return res.render("departments", {
                title: "Departments View",
                departments,
                percentages,
                error: null,
                ...buildFeedbackState(req),
            });
        } catch (err) {
            return res.status(500).render("departments", {
                title: "Departments View",
                departments: [],
                percentages: null,
                error: err.message,
                ...buildFeedbackState(req),
            });
        }
    }

    static async createDepartment(req, res) {
        try {
            await DepartmentService.create(req.body);
            return res.redirect(buildRedirectPath("/views/departments", "Department created successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/departments", err.message, "error"));
        }
    }

    static async updateDepartment(req, res) {
        try {
            await DepartmentService.update(req.params.id, req.body);
            return res.redirect(buildRedirectPath("/views/departments", "Department updated successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/departments", err.message, "error"));
        }
    }

    static async deleteDepartment(req, res) {
        try {
            await DepartmentService.delete(req.params.id);
            return res.redirect(buildRedirectPath("/views/departments", "Department deleted successfully."));
        } catch (err) {
            return res.redirect(buildRedirectPath("/views/departments", err.message, "error"));
        }
    }
}

module.exports = ViewController;
