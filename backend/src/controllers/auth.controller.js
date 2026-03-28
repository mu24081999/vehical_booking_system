// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const AuthService = require("../services/auth.service");
const Response = require("../utils/responseHelper");
class AuthController {
  constructor(service) {
    this.service = service;
  }
  async signup(req, res, next) {
    const { name, email, password } = req.body;
    const result = await this.service.processSignup(
      name,
      email,
      password,
      next,
    );
    return Response.success(res, "Registration successfull.", result, 201);
  }
  async login(req, res) {
    const { email, password } = req.body;
    const result = await this.service.processLogin(email, password, res);
    return Response.success(res, "Logged in!", result, 201);
  }
  async refresh(req, res) {
    const result = await this.service.processRefreshToken(req, res);
    return Response.success(res, "success", result);
  }
  async logout(req, res) {
    const result = await this.service.processLogout(req, res);
    return Response.success(res, result?.message);
  }
}
module.exports = new AuthController(AuthService);
