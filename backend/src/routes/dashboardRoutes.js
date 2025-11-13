import express from "express";
import {
  getWriterStats,
  getBlogAnalytics,
  getMonthlyStats,
} from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateId } from "../middleware/validationMiddleware.js";

const router = express.Router();

// All dashboard routes are protected and writer-only
router.use(protect);
router.use(authorize("writer"));

// Dashboard routes
router.get("/stats", getWriterStats);
router.get("/analytics/:blogId", validateId, getBlogAnalytics);
router.get("/monthly-stats", getMonthlyStats);

export default router;
