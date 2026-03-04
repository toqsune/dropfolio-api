import express from "express";
import rootRouter from "./core/root.route.js";
import healthRouter from "./core/health.route.js";

const router = express.Router();

// Routes - Core
router.use("/", rootRouter);
router.use("/health", healthRouter);

export default router;
