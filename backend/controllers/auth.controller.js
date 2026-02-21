import * as authService from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      "Registered successfully.",
      result,
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, HTTP_STATUS.OK, "Logged in successfully.", result);
  } catch (err) {
    next(err);
  }
};

export const getMe = (req, res) => {
  const { _id, name, email, createdAt } = req.user;
  return sendSuccess(res, HTTP_STATUS.OK, "User fetched.", {
    _id,
    name,
    email,
    createdAt,
  });
};
