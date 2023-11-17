const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares");
const {
  SignUpController,
  LoginController,
  OTPVerification,
} = require("../controller/authcontroller");

router.post("/api/signUp", SignUpController);
router.post("/api/Login", LoginController);
router.post("/api/Verification", OTPVerification);

module.exports = router;
