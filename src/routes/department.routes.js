const express = require("express");
const DepartmentController = require("../controllers/department.controller");
const { createDepartmentValidator } = require("../validators/department.validator");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermissions } = require("../middleware/authorize.middleware");
const { Permissions } = require("../auth/permissions");

const router = express.Router();

router.use(authenticate);

router.get("/dep-per", requirePermissions(Permissions.DEPARTMENTS_READ), DepartmentController.getDepPerc);
router.get("/deps-with-emps", requirePermissions(Permissions.DEPARTMENTS_READ), DepartmentController.getDepsWithEmps);
router.get("/", requirePermissions(Permissions.DEPARTMENTS_READ), DepartmentController.getAll);
router.get("/:id", requirePermissions(Permissions.DEPARTMENTS_READ), DepartmentController.getById);
router.post(
    "/",
    requirePermissions(Permissions.DEPARTMENTS_WRITE),
    createDepartmentValidator,
    DepartmentController.create
);
router.put(
    "/:id",
    requirePermissions(Permissions.DEPARTMENTS_WRITE),
    createDepartmentValidator,
    DepartmentController.update
);
router.delete(
    "/:id",
    requirePermissions(Permissions.DEPARTMENTS_WRITE),
    DepartmentController.delete
);


module.exports = router;
