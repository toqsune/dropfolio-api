import express from "express";
import rootRouter from "./core/root.route.js";
import healthRouter from "./core/health.route.js";
import authRouter from "./v1/auth.route.js";

const router = express.Router();

// Routes - Core
router.use("/", rootRouter);
router.use("/health", healthRouter);

// Routes - V1
router.use("/v1/auth", authRouter);

export default router;
