import mongoose from "mongoose";
import env from "../../../config/env.js";
import Formatter from "../../utils/Formatter.js";

class HealthController {
  // @desc    Get health check
  // @route   GET /api/health
  // @access  Public
  static getHealth = (req, res) => {
    const DB_STATES = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    const dbState = mongoose.connection.readyState;
    const dbStatus = DB_STATES[dbState] || "Unknown";
    const healthy = dbStatus === "Connected";

    res.status(healthy ? 200 : 503).json({
      status: healthy ? "healthy" : "degraded",
      services: { database: dbStatus },
      uptime: Formatter.formatUptimeString(process.uptime()),
      timestamp: new Date().toISOString(),
      version: env.core.version,
    });
  };
}

export default HealthController;
