const pool = require("../db/pool");
const ClientEntity = require("../entities/client.entity");

class ClientRepository {
    static async findAll(filters = {}) {
        const conditions = [];
        const values = [];

        if (filters.name) {
            values.push(`%${filters.name}%`);
            conditions.push(`client_name ILIKE $${values.length}`);
        }

        if (filters.email) {
            values.push(`%${filters.email}%`);
            conditions.push(`client_email ILIKE $${values.length}`);
        }

        const whereClause = conditions.length
            ? ` WHERE ${conditions.join(" AND ")}`
            : "";

        const result = await pool.query(
            `SELECT * FROM clients${whereClause} ORDER BY client_id`,
            values
        );
        return ClientEntity.fromRows(result.rows);
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT * FROM clients WHERE client_id = $1`,
            [id]
        );
        return ClientEntity.fromRow(result.rows[0]);
    }

    static async create({ name, email }) {
        const result = await pool.query(
            `INSERT INTO clients (client_name, client_email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );
        return ClientEntity.fromRow(result.rows[0]);
    }

    static async update(id, { name, email }) {
        const result = await pool.query(
            `UPDATE clients SET client_name = $1, client_email = $2 WHERE client_id = $3 RETURNING *`,
            [name, email, id]
        );
        return ClientEntity.fromRow(result.rows[0]);
    }

    static async deleteById(id) {
        await pool.query(`DELETE FROM clients WHERE client_id = $1`, [id]);
    }

    static async findAllWithDepartments() {
        const result = await pool.query(`SELECT * FROM v_clients_departments`);
        return ClientEntity.fromRows(result.rows);
    }

    static async increaseSalary(clientId, amount) {
        await pool.query("CALL increase_salary($1, $2)", [clientId, amount]);
    }

    static async authenticate(email, password){
        const result = await pool.query(
            `SELECT * FROM clients WHERE client_email = $1 AND client_password = $2`, [email, password]);
        return ClientEntity.fromRow(result.rows[0]);
    }


}

module.exports = ClientRepository;
