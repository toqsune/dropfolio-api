import env from "../../../config/env.js";

class RootController {
  // @desc    Get root message
  // @route   GET /api
  // @access  Public
  static getRootMessage = (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Dropfolio API",
      timestamp: new Date(),
      version: env.core.version,
    });
  };
}

export default RootController;
