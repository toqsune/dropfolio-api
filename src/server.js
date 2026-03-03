import app from "./app.js";
import env from "./config/env.js";
import logger from "./api/utils/logger.js";

app.listen(env.core.port, () => {
  logger.info(`Server running on port ${env.core.port}`);
});
