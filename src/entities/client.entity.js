/**
 * Client entity - represents the client row from the database.
 * Uses DB column names (snake_case).
 */
class ClientEntity {
    constructor({ client_id, client_name, client_email, dep_id, dep_name, dep_location } = {}) {
        this.client_id = client_id;
        this.client_name = client_name;
        this.client_email = client_email;
        this.dep_id = dep_id ?? null;
        this.dep_name = dep_name ?? null;
        this.dep_location = dep_location ?? null;
    }

    static fromRow(row) {
        if (!row) return null;
        return new ClientEntity(row);
    }

    static fromRows(rows) {
        return (rows || []).map((row) => ClientEntity.fromRow(row));
    }
}

module.exports = ClientEntity;
