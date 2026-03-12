const pool = require("../db/pool");
const ClientEntity = require("../entities/client.entity");

class ClientRepository {
    static async findAll() {
        const result = await pool.query(`SELECT * FROM clients ORDER BY client_id`);
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

    static async increaseSalary(clientId, amount){
        const result = await pool.query("SELECT increase_salary($1, $2)", [clientId, amount]);
        return result;
    }


}

module.exports = ClientRepository;