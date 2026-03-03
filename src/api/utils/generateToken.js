import jwt from "jsonwebtoken";
import env from "../../config/env.js";

const generateToken = (userId) => {
  const payload = { id: userId };

  return jwt.sign(payload, env.jwt.jwt_secret, {
    algorithm: "HS256",
    expiresIn: env.jwt.jwt_expires_in,
  });
};

export default generateToken;
