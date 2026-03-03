import env from "./env.js";

const options = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts:
    env.core.node_env === "production"
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
};

export default options;
