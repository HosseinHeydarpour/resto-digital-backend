const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const authController = require("../controllers/auth.controller");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/forgotPassword").post(authController.forgetPassword);
// router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/users").get(authController.protect, userController.getAllUsers);

module.exports = router;
