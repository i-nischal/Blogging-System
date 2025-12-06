import Joi from "joi";

// User validation schemas
export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("reader", "writer").default("reader"),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required(),
});

// Blog validation schemas
export const blogValidation = Joi.object({
  title: Joi.string().min(5).max(200).required().trim(),
  content: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  status: Joi.string().valid("draft", "published").default("draft"),
  coverImage: Joi.string().uri().allow("", null).optional(),
});

export const blogUpdateValidation = Joi.object({
  title: Joi.string().min(5).max(200).trim(),
  content: Joi.string().min(10),
  tags: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid("draft", "published"),
  coverImage: Joi.string().uri().allow("", null).optional(), 
});

// Comment validation schemas
export const commentValidation = Joi.object({
  content: Joi.string().min(1).max(1000).required().trim(),
});

// Like validation schemas
export const likeValidation = Joi.object({
  blogId: Joi.string().required(),
});

// ID validation schema
export const idValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// Pagination validation schema
export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});