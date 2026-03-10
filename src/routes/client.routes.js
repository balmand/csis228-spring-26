const express = require("express");
const ClientController = require("../controllers/client.controller");

const router = express.Router();

router.get("/with-departments", ClientController.getAllWithDepartments);
router.get("/", ClientController.getAll);
router.get("/:id", ClientController.getById);
router.post("/", ClientController.create);
router.put("/:id", ClientController.update)
router.delete("/:id", ClientController.delete);


module.exports = router;