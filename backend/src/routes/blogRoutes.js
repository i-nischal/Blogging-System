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
import { validate, validateId } from "../middleware/validationMiddleware.js";
import { blogValidation, blogUpdateValidation } from "../utils/validators.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get("/", getBlogs);


router.use(protect);
router.get("/my-blogs", getMyBlogs); // protected route
router.post("/:id/like", validateId, toggleLike);

// ========== PUBLIC (AFTER PROTECTED IF NEEDED) ==========
router.get("/:id", validateId, getBlog);

// ========== WRITER-ONLY ROUTES ==========
router.use(authorize("writer"));
router.post("/", validate(blogValidation), createBlog);
router.put("/:id", validateId, validate(blogUpdateValidation), updateBlog);
router.delete("/:id", validateId, deleteBlog);
router.patch("/:id/publish", validateId, togglePublish);

export default router;
