import express from "express";
import requestId from "./api/middlewares/requestId.middleware.js";
import httpLogger from "./config/morgan.js";

const app = express();

// Global middlewares
app.use(requestId());
app.use(httpLogger());

// Routes
app.get("/api", (req, res) => {
  res.send("hello world");
});

// Central middlewares

export default app;
