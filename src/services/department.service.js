const DepartmentRepository = require("../repositories/department.repository");
const EmployeeServices = require("../services/client.service");

class DepartmentService {

    static async getAll(){
        return await DepartmentRepository.findAll();
    }

    static async getById(id){
        const dep = await DepartmentRepository.findById(id);
        if(!dep){
            throw new Error("Dep not found");
        }
        return dep;
    }

    static async create(data){
        if(!data.name || !data.location){
            throw new Error("Name and location are required");
        }

        return DepartmentRepository.create(data)
    }

    static async update(id, data){
        if(!id || !data.name || !data.location){
            throw new Error("ID, Name and location are required");
        }
        return DepartmentRepository.update(id, data);
    }

    static async delete(id){
        if(!id){
            throw new Error("ID is required");
        }
        const dep = DepartmentRepository.findById(id);
        if(!dep){
            throw new Error("Client Not found");
        }
        return DepartmentRepository.deleteById(id);
    }

    static async departmentsClients(){
        const deps = await DepartmentRepository.findDepartmentClients();
        if(!deps){
            throw new Error("Data not found");
        }
        return deps;
    }

    static async depPer () {
        const deps = await this.getAll();
        const emps = await EmployeeServices.getAllClients();
        let itIndex = 0;
        let salesIndex = 0;
        let hrIndex = 0;

        for(let dep of deps){
            for(let emp of emps){
                if(emp.dep_id === dep.dep_id){
                    switch(dep.dep_name){
                        case "Sales": salesIndex++;
                            break;
                        case "IT" : itIndex++;
                            break;
                        case "hr" : hrIndex++;
                    }
                }
            }
        }

        return{
            "Sales": ((salesIndex / emps.length)*100),
            "IT": ((itIndex / emps.length)*100),
            "HR": ((hrIndex / emps.length)*100),
        }

    }

}

module.exports = DepartmentService;