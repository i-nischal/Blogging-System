import express from "express";
import {
  toggleLike,
  getLikeStatus,
  getMyLikes,
  getLikeCount,
  getLikedUsers,
} from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateId } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.get("/blog/:blogId/count", validateId, getLikeCount);
router.get("/blog/:blogId/users", validateId, getLikedUsers);

// Protected routes
router.use(protect);

router.post("/blog/:blogId", validateId, toggleLike);
router.get("/blog/:blogId/status", validateId, getLikeStatus);
router.get("/my-likes", getMyLikes);

export default router;
