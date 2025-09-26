const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const authController = require("../controllers/auth.controller");

router.route("/signup").post(authController.signup);
