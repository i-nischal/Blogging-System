import express from "express";
import {
  createComment,
  getBlogComments,
  updateComment,
  deleteComment,
  getMyComments,
  getComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate, validateId } from "../middleware/validationMiddleware.js";
import { commentValidation, idValidation } from "../utils/validators.js";

const router = express.Router();

// Public routes
router.get("/blog/:blogId", validateId, getBlogComments);
router.get("/:id", validateId, getComment);

// Protected routes
router.use(protect);

router.post(
  "/blog/:blogId",
  validateId,
  validate(commentValidation),
  createComment
);
router.get("/my-comments", getMyComments);
router.put("/:id", validateId, validate(commentValidation), updateComment);
router.delete("/:id", validateId, deleteComment);

export default router;
