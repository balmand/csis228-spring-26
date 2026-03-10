const pool = require("../db/pool");

class DepartmentRepository {
    static async findAll(){
        const result = await pool.query(`SELECT * FROM departments 
            order by dep_id`);
        return result.rows;
    }
    
    static async findById(id){
        const result = await pool.query(`SELECT * FROM departments
		WHERE dep_id = $1`, [id]);
        return result.rows[0];
    }

    static async create({name, location}){
        const result = await pool.query
		(`INSERT INTO departments 
            (dep_name, dep_location) 
            VALUES ($1, $2) RETURNING *`, [name, location]);
        return result.rows[0];
    }

    static async update(id, {name, location})
    {
        const result = await pool.query(`UPDATE departments 
			SET dep_name = $1,
			dep_location = $2 
			WHERE dep_id =$3 RETURNING *`, [name, location, id]);
        return result.rows[0];

    }

    static async deleteById(id){
        await pool.query(`DELETE FROM departments
            WHERE dep_id = $1`, [id]);
    }

    static async findDepartmentClients(){
        const result = await pool.query('SELECT * FROM dep_emp()');
        return result.rows;
    }


}

module.exports = DepartmentRepository;