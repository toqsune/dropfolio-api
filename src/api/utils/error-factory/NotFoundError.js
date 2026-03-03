import ApiError from "./ApiError.js";

class NotFoundError extends ApiError {
  constructor(message, path, statusCode = 404) {
    super(message, statusCode);
    this.path = path;
  }
}

export default NotFoundError;
