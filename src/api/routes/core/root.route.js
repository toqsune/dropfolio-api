import express from "express";
import RootController from "../../controllers/core/root.controller.js";

const router = express.Router();

// Routes
router.get("/", RootController.getRootMessage);

export default router;
