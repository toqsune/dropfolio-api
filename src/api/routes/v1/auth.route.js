import express from "express";
import AuthController from "../../controllers/v1/auth.controller.js";

const router = express.Router();

// Routes
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

export default router;
