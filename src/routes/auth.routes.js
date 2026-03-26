const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.me);

module.exports = router;
