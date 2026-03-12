/**
 * Department entity - represents the department row from the database.
 * Uses DB column names (snake_case).
 */
class DepartmentEntity {
    constructor({ dep_id, dep_name, dep_location } = {}) {
        this.dep_id = dep_id;
        this.dep_name = dep_name;
        this.dep_location = dep_location;
    }

    static fromRow(row) {
        if (!row) return null;
        return new DepartmentEntity(row);
    }

    static fromRows(rows) {
        return (rows || []).map((row) => DepartmentEntity.fromRow(row));
    }
}

module.exports = DepartmentEntity;
