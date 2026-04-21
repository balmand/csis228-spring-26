const request = require("supertest");

const mockClientService = {
    getAllClients: jest.fn().mockResolvedValue([
        { id: 1, name: "Ava", email: "ava@example.com" },
    ]),
    getAllClientsWithDepartments: jest.fn().mockResolvedValue([
        {
            id: 1,
            name: "Ava",
            email: "ava@example.com",
            department: { id: 2, name: "IT", location: "Beirut" },
        },
    ]),
    createClient: jest.fn().mockResolvedValue({
        id: 3,
        name: "Lina",
        email: "lina@example.com",
    }),
    updateClient: jest.fn().mockResolvedValue({
        id: 1,
        name: "Ava Updated",
        email: "ava.updated@example.com",
    }),
    deleteClient: jest.fn().mockResolvedValue(),
};

const mockDepartmentService = {
    getAll: jest.fn().mockResolvedValue([
        { id: 2, name: "IT", location: "Beirut" },
    ]),
    depPer: jest.fn().mockResolvedValue({
        IT: 100,
        Sales: 0,
        HR: 0,
    }),
    create: jest.fn().mockResolvedValue({
        id: 5,
        name: "HR",
        location: "Tripoli",
    }),
    update: jest.fn().mockResolvedValue({
        id: 2,
        name: "IT Ops",
        location: "Beirut",
    }),
    delete: jest.fn().mockResolvedValue(),
};

jest.mock("../services/client.service", () => mockClientService);
jest.mock("../services/department.service", () => mockDepartmentService);

const app = require("../app");

describe("EJS views", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockClientService.getAllClients.mockResolvedValue([
            { id: 1, name: "Ava", email: "ava@example.com" },
        ]);
        mockClientService.getAllClientsWithDepartments.mockResolvedValue([
            {
                id: 1,
                name: "Ava",
                email: "ava@example.com",
                department: { id: 2, name: "IT", location: "Beirut" },
            },
        ]);
        mockClientService.createClient.mockResolvedValue({
            id: 3,
            name: "Lina",
            email: "lina@example.com",
        });
        mockClientService.updateClient.mockResolvedValue({
            id: 1,
            name: "Ava Updated",
            email: "ava.updated@example.com",
        });
        mockClientService.deleteClient.mockResolvedValue();

        mockDepartmentService.getAll.mockResolvedValue([
            { id: 2, name: "IT", location: "Beirut" },
        ]);
        mockDepartmentService.depPer.mockResolvedValue({
            IT: 100,
            Sales: 0,
            HR: 0,
        });
        mockDepartmentService.create.mockResolvedValue({
            id: 5,
            name: "HR",
            location: "Tripoli",
        });
        mockDepartmentService.update.mockResolvedValue({
            id: 2,
            name: "IT Ops",
            location: "Beirut",
        });
        mockDepartmentService.delete.mockResolvedValue();
    });

    it("renders the home page", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Rendered views for your Express project");
        expect(response.text).toContain("Open clients view");
    });

    it("renders the clients page", async () => {
        const response = await request(app).get("/views/clients");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Clients");
        expect(response.text).toContain("ava@example.com");
        expect(response.text).toContain("Create client");
    });

    it("creates a client from the views page", async () => {
        const response = await request(app)
            .post("/views/clients")
            .type("form")
            .send({ name: "Lina", email: "lina@example.com" });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toContain("/views/clients");
        expect(mockClientService.createClient).toHaveBeenCalledWith({
            name: "Lina",
            email: "lina@example.com",
        });
    });

    it("updates a client from the views page", async () => {
        const response = await request(app)
            .post("/views/clients/1/update")
            .type("form")
            .send({ name: "Ava Updated", email: "ava.updated@example.com" });

        expect(response.statusCode).toBe(302);
        expect(mockClientService.updateClient).toHaveBeenCalledWith("1", {
            name: "Ava Updated",
            email: "ava.updated@example.com",
        });
    });

    it("deletes a client from the views page", async () => {
        const response = await request(app).post("/views/clients/1/delete");

        expect(response.statusCode).toBe(302);
        expect(mockClientService.deleteClient).toHaveBeenCalledWith("1");
    });

    it("renders the departments page", async () => {
        const response = await request(app).get("/views/departments");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Departments");
        expect(response.text).toContain("Beirut");
        expect(response.text).toContain("Create department");
    });

    it("creates a department from the views page", async () => {
        const response = await request(app)
            .post("/views/departments")
            .type("form")
            .send({ name: "HR", location: "Tripoli" });

        expect(response.statusCode).toBe(302);
        expect(mockDepartmentService.create).toHaveBeenCalledWith({
            name: "HR",
            location: "Tripoli",
        });
    });

    it("updates a department from the views page", async () => {
        const response = await request(app)
            .post("/views/departments/2/update")
            .type("form")
            .send({ name: "IT Ops", location: "Beirut" });

        expect(response.statusCode).toBe(302);
        expect(mockDepartmentService.update).toHaveBeenCalledWith("2", {
            name: "IT Ops",
            location: "Beirut",
        });
    });

    it("deletes a department from the views page", async () => {
        const response = await request(app).post("/views/departments/2/delete");

        expect(response.statusCode).toBe(302);
        expect(mockDepartmentService.delete).toHaveBeenCalledWith("2");
    });
});
