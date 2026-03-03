import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import Context from "./Context.js";

// Paths
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "../../logs");
const NODE_ENV = process.env.NODE_ENV || "development";

// Utils
const filterLevel = (level) =>
  winston.format((info) => (info.level === level ? info : false))();

const requestIdFormat = winston.format((info) => {
  const context = Context.getContext();
  if (context?.requestId) info.requestId = context.requestId;
  return info;
});

const formatResponseTime = (time) => {
  const ms = parseFloat(time);
  return isNaN(ms) ? time : Number((ms / 1000).toFixed(2));
};

const formatSize = (bytes) => {
  return bytes == null || isNaN(bytes) ? 0 : Number((bytes / 1024).toFixed(2));
};

// Console color definitions
const colors = {
  info: "\x1b[32m",
  error: "\x1b[31m",
  warn: "\x1b[33m",
  debug: "\x1b[34m",
  http: "\x1b[36m",
  audit: "\x1b[35m",
  reset: "\x1b[0m",
};

const colorStatusCode = (code) => {
  const status = Number(code);
  if (status >= 500) return `\x1b[31m${code}${colors.reset}`;
  if (status >= 400) return `\x1b[33m${code}${colors.reset}`;
  return `\x1b[32m${code}${colors.reset}`;
};

const colorLevel = (level) => {
  const color = colors[level] || "";
  return `${color}${level.toUpperCase()}${colors.reset}`;
};

// Formats
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  requestIdFormat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, requestId } = info;
    const reqIdStr = requestId ? ` (${requestId})` : "";

    // HTTP log
    if (level === "http" && typeof message === "object") {
      const { method, url, status, responseTime, size } = message;
      return `${timestamp} [${colorLevel(level)}]:${reqIdStr} ${method} ${url} ${colorStatusCode(status)} ${formatResponseTime(responseTime)}ms - ${formatSize(size)}KB`;
    }

    // Standard log
    const output =
      typeof message === "object"
        ? (message.message ?? "[no message]")
        : message;

    return `${timestamp} [${colorLevel(level)}]:${reqIdStr} ${output}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  requestIdFormat(),
  winston.format.printf((info) => {
    const { timestamp, level, requestId, message, ...rest } = info;
    const ordered = {};

    // Fixed header order
    ordered.timestamp = timestamp;
    ordered.level = level;

    if (requestId) ordered.requestId = requestId;

    // Flatten message object or string
    if (typeof message === "object" && message !== null) {
      Object.keys(message).forEach((key) => {
        if (level === "http" && key === "size") {
          ordered.size = formatSize(message.size);
        } else if (level === "http" && key === "responseTime") {
          ordered.responseTime = formatResponseTime(message.responseTime);
        } else {
          ordered[key] = message[key];
        }
      });
    } else if (message !== undefined) {
      ordered.message = message;
    }

    // Add any additional metadata
    Object.keys(rest).forEach((key) => {
      if (!(key in ordered)) ordered[key] = rest[key];
    });

    // System context
    ordered.environment = NODE_ENV;
    ordered.service = "dropfolio-api";

    return JSON.stringify(ordered);
  }),
);

// Initialize logger
const levels = {
  info: 2,
  error: 0,
  warn: 1,
  debug: 5,
  audit: 4,
  http: 3,
};

const createDevFileTransport = (level) =>
  new DailyRotateFile({
    dirname: path.join(LOG_DIR, "%DATE%"),
    filename: `${level}.log`,
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    format: winston.format.combine(filterLevel(level), fileFormat),
  });

const createProdFileTransport = () =>
  new DailyRotateFile({
    dirname: LOG_DIR,
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
    format: fileFormat,
  });

const transports = [new winston.transports.Console({ format: consoleFormat })];

if (NODE_ENV === "production") {
  transports.push(createProdFileTransport());
} else {
  Object.keys(levels).forEach((level) => {
    transports.push(createDevFileTransport(level));
  });
}

const logger = winston.createLogger({
  levels,
  level: NODE_ENV === "production" ? "audit" : "debug",
  transports,
});

// Handle both object and string inputs
const logWithLevel = (level, payload) => {
  return logger.log({ level, message: payload });
};

logger.info = (p) => logWithLevel("info", p);
logger.http = (p) => logWithLevel("http", p);
logger.error = (p) => logWithLevel("error", p);
logger.audit = (p) => logWithLevel("audit", p);
logger.debug = (p) => logWithLevel("debug", p);
logger.warn = (p) => logWithLevel("warn", p);

export default logger;
