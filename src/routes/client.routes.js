const express = require("express");
const ClientController = require("../controllers/client.controller");
const { createValidator } = require("../validators/client.validator");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermissions } = require("../middleware/authorize.middleware");
const { Permissions } = require("../auth/permissions");

const router = express.Router();

router.use(authenticate);

router.get("/with-departments", ClientController.getAllWithDepartments);
router.get("/", requirePermissions(Permissions.CLIENTS_READ),  ClientController.getAll);
router.get("/:id", requirePermissions(Permissions.CLIENTS_READ), ClientController.getById);
router.post(
    "/",
    requirePermissions(Permissions.CLIENTS_WRITE),
    createValidator,
    ClientController.create
);
router.put(
    "/:id",
    requirePermissions(Permissions.CLIENTS_WRITE),
    createValidator,
    ClientController.update
);
router.delete("/:id", requirePermissions(Permissions.CLIENTS_WRITE), ClientController.delete);


module.exports = router;
