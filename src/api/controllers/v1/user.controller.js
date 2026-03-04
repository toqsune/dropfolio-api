import asyncHandler from "express-async-handler";

import { getMeService } from "../../services/user.service.js";

// @desc    Get user profile
// @route   POST /api/v1/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const userData = req.user;

  const { message, data } = await getMeService(userData);

  res.status(200).json({
    success: true,
    message,
    data,
  });
});

export { getMe };
