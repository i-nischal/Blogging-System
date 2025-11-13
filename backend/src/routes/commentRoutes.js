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
import { commentValidation } from "../utils/validators.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get("/blog/:blogId", validateId, getBlogComments);


router.use(protect);
router.get("/my-comments", getMyComments);

// ========== DYNAMIC ROUTES ==========
router.get("/:id", validateId, getComment);

// ========== PROTECTED ROUTES ==========
router.post(
  "/blog/:blogId",
  validateId,
  validate(commentValidation),
  createComment
);
router.put("/:id", validateId, validate(commentValidation), updateComment);
router.delete("/:id", validateId, deleteComment);

export default router;
