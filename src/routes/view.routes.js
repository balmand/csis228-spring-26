const express = require("express");
const ViewController = require("../controllers/view.controller");

const router = express.Router();

router.get("/", ViewController.renderHome);
router.get("/views/clients", ViewController.renderClients);
router.get("/views/departments", ViewController.renderDepartments);

module.exports = router;
