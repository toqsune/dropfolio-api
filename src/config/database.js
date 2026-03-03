import mongoose from "mongoose";
import env from "./env.js";
import logger from "../api/utils/logger.js";

let isConnected = false;

const attachListeners = () => {
  if (global.__MONGOOSE_LISTENERS_ATTACHED__) return;

  mongoose.connection.on("connected", () => {
    logger.info("Database connection established");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("Database disconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error({
      message: "Database connection error",
      error: err.message,
    });
  });

  process.once("SIGTERM", async () => {
    await mongoose.connection.close();
    logger.info("Database connection closed (SIGTERM)");
    process.exit(0);
  });

  process.once("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("Database connection closed (SIGINT)");
    process.exit(0);
  });

  global.__MONGOOSE_LISTENERS_ATTACHED__ = true;
};

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(env.core.db_uri);
    isConnected = true;

    attachListeners();

    logger.info({
      message: "Database connected",
      host: conn.connection.host,
      name: conn.connection.name,
    });

    return conn;
  } catch (error) {
    logger.error({
      message: "Database initial connection failed",
      error: error.message,
    });
    process.exit(1);
  }
};

export default connectDB;
