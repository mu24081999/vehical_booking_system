const express = require("express");
const router = express.Router();

const validatePayload = require("../middlewares/validatePayload.middleware");
const {
  loginSchema,
  registerSchema,
} = require("../validators/admin.validator");
const AuthController = require("../controllers/auth.controller");

router.post(
  "/sign-up",
  validatePayload(registerSchema),
  AuthController.signup.bind(AuthController),
);

router.post(
  "/sign-in",
  validatePayload(loginSchema),
  AuthController.login.bind(AuthController),
);

router.get("/refresh-token", AuthController.refresh.bind(AuthController));
router.get("/logout", AuthController.logout.bind(AuthController));

module.exports = router;
