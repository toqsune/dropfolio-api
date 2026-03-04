import logger from "../utils/logger.js";

const getMeService = async (userData) => {
  // Log activity
  logger.audit({
    message: "User profile retrieved",
    name: userData?.name,
    email: userData?.email,
  });

  return { message: "User profile successfully retrieved", data: userData };
};

export { getMeService };
