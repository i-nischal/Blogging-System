import express from "express";
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
} from "../controllers/uploadController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  uploadSingle,
  uploadMultiple,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All upload routes are protected and writer-only
router.use(protect);
router.use(authorize("writer"));

router.post("/single", uploadSingle("image"), uploadSingleImage);
router.post("/multiple", uploadMultiple("images", 10), uploadMultipleImages);
router.delete("/:publicId", deleteImage);

export default router;
