import NotFoundError from "../utils/error-factory/NotFoundError.js";

const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError("Route not matched", req.path);
  next(error);
};

export default notFoundHandler;
