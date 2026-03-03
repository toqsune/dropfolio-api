import morgan from "morgan";
import logger from "../api/utils/logger.js";

const httpLogger = () =>
  morgan((tokens, req, res) => {
    logger.http({
      ip: req.ip,
      method: tokens["method"](req, res),
      url: req.originalUrl,
      status: Number(tokens["status"](req, res)),
      responseTime: Number(tokens["response-time"](req, res) || 0),
      size: Number(tokens["res"](req, res, "content-length") || 0),
    });
  });

export default httpLogger;
