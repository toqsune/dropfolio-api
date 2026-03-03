import ApiError from "./ApiError.js";

class ValidationError extends ApiError {
  constructor(message, statusCode = 400, details = null) {
    super(message, statusCode);
    this.details = details;
  }
}

export default ValidationError;
