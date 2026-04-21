const ClientService = require("../services/client.service");
const DepartmentService = require("../services/department.service");

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
            });
        } catch (err) {
            return res.status(500).render("clients", {
                title: "Clients View",
                clients: [],
                error: err.message,
            });
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
            });
        } catch (err) {
            return res.status(500).render("departments", {
                title: "Departments View",
                departments: [],
                percentages: null,
                error: err.message,
            });
        }
    }
}

module.exports = ViewController;
