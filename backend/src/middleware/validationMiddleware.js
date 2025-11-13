import ApiResponse from "../utils/apiResponse.js";
import { idValidation } from "../utils/validators.js"; // ← ADD THIS IMPORT

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
 * Validate MongoDB ObjectId
 */
export const validateId = (req, res, next) => {
  const { error } = idValidation.validate({ id: req.params.id });

  if (error) {
    return res.status(400).json(ApiResponse.error("Invalid ID format"));
  }

  next();
};
