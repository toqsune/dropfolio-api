import env from "./env.js";

const allowedOrigins = env.core.cors_origins?.split(",") || [];

const options = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      env.core.node_env === "development" ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

export default options;
