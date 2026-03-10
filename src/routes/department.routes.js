const express = require("express");
const DepartmentController = require("../controllers/department.controller");

const router = express.Router();

router.get("/dep-per", DepartmentController.getDepPerc);
router.get("/deps-with-emps", DepartmentController.getDepsWithEmps);
router.get("/", DepartmentController.getAll);
router.get("/:id", DepartmentController.getById);
router.post("/", DepartmentController.create);
router.put("/:id", DepartmentController.update)
router.delete("/:id", DepartmentController.delete);


module.exports = router;