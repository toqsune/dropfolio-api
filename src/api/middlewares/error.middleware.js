import logger from "../utils/logger.js";
import env from "../../config/env.js";
import ApiError from "../utils/error-factory/ApiError.js";

const normalizeError = (err) => {
  if (err instanceof ApiError) return err;
  const statusCode =
    err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const wrapped = new ApiError(
    err.message || "Internal server error",
    statusCode,
    false,
  );
  wrapped.stack = err.stack;
  return wrapped;
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const error = normalizeError(err);
  const statusCode = error.statusCode || 500;
  const logLevel = statusCode >= 500 ? "error" : "warn";
  const logMethod = logger[logLevel] || logger.error;

  // Log full structured error
  logMethod({
    name: error.name,
    message: error.message,
    statusCode,
    operational: error.operational,
    method: req.method,
    url: req.originalUrl,
    ...(error.details && { details: error.details }),
    ...(env.core.node_env === "development" && { stack: error.stack }),
  });

  // Safe client response
  const response = {
    success: false,
    name: error.name,
    message:
      error.operational || env.core.node_env === "development"
        ? error.message
        : "Internal server error",
    ...(error.details && { details: error.details }),
    ...(error.path && { path: error.path }),
  };

  if (env.core.node_env === "development") {
    response.operational = error.operational;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
