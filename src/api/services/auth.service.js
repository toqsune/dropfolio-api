import User from "../models/user.model.js";
import ValidationError from "../utils/error-factory/ValidationError.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";

class AuthService {
  // Handle user registration
  static register = async (inputData) => {
    try {
      const { name, email, password, location } = inputData;

      const newUser = await User.create({ name, email, password, location });

      const token = generateToken(newUser._id.toString());

      // Log activity
      logger.audit({
        message: "User registered",
        name: newUser.name,
        email: newUser.email,
      });

      return {
        message: "User successfully created",
        token,
        data: newUser.toObject(),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ValidationError("Email already registered");
      }
      throw error;
    }
  };

  // Handle user login
  static login = async (inputData) => {
    const { email, password } = inputData;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.verifyPassword(password))) {
      throw new ValidationError("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    // Log activity
    logger.audit({
      message: "User logged in",
      name: user.name,
      email: user.email,
    });

    return {
      message: "User successfully logged in",
      token,
      data: user.toObject(),
    };
  };
}

export default AuthService;
