const express = require("express");
const DepartmentController = require("../controllers/department.controller");
const { createDepartmentValidator } = require("../validators/department.validator");

const router = express.Router();

router.get("/dep-per", DepartmentController.getDepPerc);
router.get("/deps-with-emps", DepartmentController.getDepsWithEmps);
router.get("/", DepartmentController.getAll);
router.get("/:id", DepartmentController.getById);
router.post("/", createDepartmentValidator, DepartmentController.create);
router.put("/:id", createDepartmentValidator, DepartmentController.update);
router.delete("/:id", DepartmentController.delete);


module.exports = router;