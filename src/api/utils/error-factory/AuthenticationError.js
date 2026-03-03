import ApiError from "./ApiError.js";

class AuthenticationError extends ApiError {
  constructor(message, statusCode = 401) {
    super(message, statusCode);
  }
}

export default AuthenticationError;
