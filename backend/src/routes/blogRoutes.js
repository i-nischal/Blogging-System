import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  togglePublish,
  toggleLike,
} from "../controllers/blogController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js"; // Remove validateId import
import { blogValidation, blogUpdateValidation } from "../utils/validators.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlog); // ← Remove validateId temporarily

// Protected routes
router.use(protect);

// Like route (any authenticated user)
router.post("/:id/like", toggleLike); // ← Remove validateId temporarily

// Writer only routes
router.use(authorize("writer"));

router.post("/", validate(blogValidation), createBlog);
router.get("/my-blogs", getMyBlogs);
router.put("/:id", validate(blogUpdateValidation), updateBlog); // ← Remove validateId temporarily
router.delete("/:id", deleteBlog); // ← Remove validateId temporarily
router.patch("/:id/publish", togglePublish); // ← Remove validateId temporarily

export default router;
