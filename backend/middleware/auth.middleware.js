import User from "../models/User.model.js";
import { verifyToken } from "../utils/token.js";
import { sendError } from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "User no longer exists.");
    }

    req.user = user;
    next();
  } catch {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Token is invalid or expired.");
  }
};
