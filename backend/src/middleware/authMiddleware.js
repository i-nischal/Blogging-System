import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "./asyncHandler.js";
import { verifyToken } from "../utils/generateToken.js";

/**
 * Protect routes - require JWT token from cookies
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized("Not authorized, no token"));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json(ApiResponse.unauthorized("User not found"));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized("Not authorized, token failed"));
  }
});

/**
 * Authorize by roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.forbidden(
            `User role ${req.user.role} is not authorized to access this route`
          )
        );
    }
    next();
  };
};
