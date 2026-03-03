class ApiError extends Error {
  constructor(message, statusCode, operational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.operational = operational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
