import mongoose from "mongoose";
import ApiResponse from "../utils/apiResponse.js";

/**
 * Generic validation middleware using Joi schemas
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    if (error) {
      const errorMessage = error.details[0].message.replace(/['"]/g, "");
      return res.status(400).json(ApiResponse.error(errorMessage));
    }

    next();
  };
};

/**
 * Validate MongoDB ObjectId - SMART VERSION
 */
export const validateId = (req, res, next) => {
  // Only validate if there's actually an ID parameter
  if (!req.params.id) {
    return next();
  }

  // Use mongoose's built-in validation (more reliable)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(ApiResponse.error("Invalid ID format"));
  }

  next();
};
