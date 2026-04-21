const request = require("supertest");

jest.mock("../services/client.service", () => ({
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
}));

jest.mock("../services/department.service", () => ({
    getAll: jest.fn().mockResolvedValue([
        { id: 2, name: "IT", location: "Beirut" },
    ]),
    depPer: jest.fn().mockResolvedValue({
        IT: 100,
        Sales: 0,
        HR: 0,
    }),
}));

const app = require("../app");

describe("EJS views", () => {
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
        expect(response.text).toContain("IT");
    });

    it("renders the departments page", async () => {
        const response = await request(app).get("/views/departments");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Departments");
        expect(response.text).toContain("Beirut");
        expect(response.text).toContain("100.0%");
    });
});
