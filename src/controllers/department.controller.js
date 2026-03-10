const DepartmentService = require("../services/department.service");

// HTTP only (GET POST PUT DELETE)
class DepartmentController{
    static async getAll(req, res){
        try{
            const departments = await DepartmentService.getAll();
            res.json(departments);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async getById(req, res){
        try{
            const department = await DepartmentService.getById(req.params.id);
            res.json(department);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async create(req, res){
        try{
            const dep = await DepartmentService.create(req.body);
            res.status(201).json(dep)
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async update(req, res){
        try{
            const dep = await DepartmentService.update(req.params.id, req.body);
            res.status(201).json(dep);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async delete(req, res){
        try{
            await DepartmentService.delete(req.params.id);
            res.json({message: "Dep deleted"})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async getDepsWithEmps(req, res){
        try{
            const deps = await DepartmentService.departmentsClients();
            res.status(200).json(deps);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    static async getDepPerc(req, res){
        try{
            const result = await DepartmentService.depPer();
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }
}

module.exports = DepartmentController;