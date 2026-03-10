const ClientRepository = require("../repositories/client.repository");

class ClientService {

    static async getAllClients(){
        return await ClientRepository.findAll();
    }

    static async getClientById(id){
        const client = await ClientRepository.findById(id);
        if(!client){
            throw new Error("Client not found");
        }
        return client;
    }

    static async createClient(data){
        if(!data.name || !data.email){
            throw new Error("Name and email are required");
        }

        return ClientRepository.create(data)
    }

    static async updateClient(id, data){
        if(!id || !data.email || !data.name){
            throw new Error("ID, Name and email are required");
        }
        return ClientRepository.update(id, data);
    }

    static async deleteClient(id){
        if(!id){
            throw new Error("ID is required");
        }
        const client = ClientRepository.findById(id);
        if(!client){
            throw new Error("Client Not found");
        }
        return ClientRepository.deleteById(id);
    }

    static async getAllClientsWithDepartments(){
        const rows = await ClientRepository.findAllWithDepartments();
        return rows.map(client => ({
            id: client.client_id,
            name: client.client_name,
            department: 
            client.dep_id ? 
            {
                id: client.dep_id, 
                name: client.dep_name,
                location: client.dep_location
            } : null

        }))
    }

}

module.exports = ClientService;