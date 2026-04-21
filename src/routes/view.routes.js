const express = require("express");
const ViewController = require("../controllers/view.controller");

const router = express.Router();

router.get("/", ViewController.renderHome);

router.get("/views/clients", ViewController.renderClients);
router.post("/views/clients", ViewController.createClient);
router.post("/views/clients/:id/update", ViewController.updateClient);
router.post("/views/clients/:id/delete", ViewController.deleteClient);

router.get("/views/departments", ViewController.renderDepartments);
router.post("/views/departments", ViewController.createDepartment);
router.post("/views/departments/:id/update", ViewController.updateDepartment);
router.post("/views/departments/:id/delete", ViewController.deleteDepartment);

module.exports = router;
