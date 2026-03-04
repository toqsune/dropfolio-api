import asyncHandler from "express-async-handler";
import AuthService from "../../services/auth.service.js";

class AuthController {
  // @desc    Register a user
  // @route   POST /api/v1/auth/register
  // @access  Public
  static registerUser = asyncHandler(async (req, res) => {
    const inputData = req.body;

    const { message, token, data } = await AuthService.register(inputData);

    res.status(201).json({ success: true, token, message, data });
  });

  // @desc    Login a user
  // @route   POST /api/v1/auth/login
  // @access  Public
  static loginUser = asyncHandler(async (req, res) => {
    const inputData = req.body;

    const { message, token, data } = await AuthService.login(inputData);

    res.status(200).json({ success: true, message, token, data });
  });
}

export default AuthController;
