import User from "../models/User.model.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email is already registered.");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id });

  return { token, user: { _id: user._id, name: user.name, email: user.email } };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user._id });

  return { token, user: { _id: user._id, name: user.name, email: user.email } };
};
