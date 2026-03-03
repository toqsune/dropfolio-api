import { v4 } from "uuid";
import Context from "../utils/Context.js";

const requestId = () => (req, res, next) => {
  // Create or use request ID
  const id = v4().replace(/-/g, "").slice(0, 8);
  const reqId = req.headers["x-request-id"] || id;

  req.requestId = reqId;
  res.setHeader("x-request-id", reqId);

  // Store request ID in context
  Context.setContext({ requestId: reqId }, () => {
    next();
  });
};

export default requestId;
