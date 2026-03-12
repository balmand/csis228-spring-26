const express = require("express");
const ClientController = require("../controllers/client.controller");
const { createValidator } = require("../validators/client.validator");

const router = express.Router();

router.get("/with-departments", ClientController.getAllWithDepartments);
router.get("/test", ClientController.getTest);
router.get("/", ClientController.getAll);
router.get("/:id", ClientController.getById);
router.post("/", createValidator, ClientController.create);
router.put("/:id", ClientController.update);
router.delete("/:id", ClientController.delete);

module.exports = router;