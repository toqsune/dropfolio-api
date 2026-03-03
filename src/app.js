import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors_options from "./config/cors.js";
import helmet_options from "./config/helmet.js";
import limiter from "./config/limiter.js";
import requestId from "./api/middlewares/requestId.middleware.js";
import httpLogger from "./config/morgan.js";
import notFoundHandler from "./api/middlewares/notfound.middleware.js";
import errorHandler from "./api/middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

// Global middlewares
app.use(cors(cors_options));
app.use(helmet(helmet_options));
app.use(requestId());
app.use(httpLogger());
app.use(limiter("global"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

// Routes

// Central middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
