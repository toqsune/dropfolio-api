/**
 * @file rateLimiter.js
 * @description
 * Centralized rate-limiting configuration using `express-rate-limit`.
 *
 * Provides predefined limiter profiles for:
 * - global requests
 * - login attempts
 * - account registration
 * - authenticated user actions
 *
 * Each profile can be extended or overridden when creating a limiter instance.
 */

import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Predefined rate limiting profiles.
 *
 * @type {Object<string, import("express-rate-limit").Options>}
 */
const profiles = {
  /**
   * Global rate limiter applied to all incoming requests.
   * Limits each IP to 100 requests per 15 minutes.
   */
  global: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests. Please try again later." },
  },

  /**
   * Login rate limiter.
   * Limits failed login attempts to 5 per 15 minutes per email + IP combination.
   * Successful login attempts are not counted.
   */
  login: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      const email = req.body?.email?.toLowerCase();
      const ip = ipKeyGenerator(req);

      return email ? `login:${email}:${ip}` : ip;
    },
    message: { message: "Too many login attempts. Please try again later." },
  },

  /**
   * Registration rate limiter.
   * Limits account creation attempts to 3 per hour per email + IP combination.
   */
  register: {
    windowMs: 60 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => {
      const email = req.body?.email?.toLowerCase();
      const ip = ipKeyGenerator(req);

      return email ? `register:${email}:${ip}` : ip;
    },
    message: { message: "Account creation limit reached. Try again later." },
  },

  /**
   * User-specific rate limiter.
   * Allows up to 200 requests per 15 minutes per IP.
   */
  user: {
    windowMs: 15 * 60 * 1000,
    max: 200,
    keyGenerator: (req) => ipKeyGenerator(req),
    message: { message: "Too many user requests." },
  },
};

/**
 * Creates a configured rate limiter middleware instance.
 *
 * @param {"global" | "login" | "register" | "user"} [type="global"]
 * The predefined limiter profile to use.
 *
 * @param {import("express-rate-limit").Options} [overrides={}]
 * Optional configuration overrides that will be merged with the selected profile.
 *
 * @returns {import("express").RequestHandler}
 * An Express middleware enforcing the configured rate limit.
 *
 * @example
 * // Apply global rate limiting
 * app.use(limiter());
 *
 * @example
 * // Apply login rate limiting
 * app.post("/login", limiter("login"), loginController);
 *
 * @example
 * // Apply custom override
 * app.use(limiter("global", { max: 50 }));
 */
const limiter = (type = "global", overrides = {}) => {
  const profile = profiles[type] || profiles.global;

  return rateLimit({
    ...profile,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    ...overrides,
  });
};

export default limiter;
