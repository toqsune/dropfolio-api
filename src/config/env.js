import logger from "../api/utils/logger.js";

const required = [];

required.forEach((var_) => {
  if (!var_ || process.env[var_] === "" || process.env[var_] == null) {
    logger.error(`${var_} is not configured`);
    process.exit(1);
  }
});

const env = {
  core: {
    port: Number(process.env.PORT) || 3000,
    node_env: process.env.NODE_ENV || "development",
    version: process.env.VERSION || "1.0.0",
  },
};

export default Object.freeze(env);
