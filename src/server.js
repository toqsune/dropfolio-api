import app from "./app.js";
import env from "./config/env.js";
import logger from "./api/utils/logger.js";
import connectDB from "./config/database.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.core.port, () => {
      logger.info(`Server running on port ${env.core.port}`);
    });
  } catch (error) {
    logger.error({ message: "Server startup failed", error: error.message });
    process.exit(1);
  }
};

startServer();
