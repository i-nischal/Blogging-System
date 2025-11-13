import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  requestUpgrade,
  updateProfile,
  becomeWriter,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { registerValidation, loginValidation } from "../utils/validators.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", logout); // ← Logout is public (clears cookie)

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, validate(registerValidation), updateProfile);
router.post("/upgrade-request", protect, requestUpgrade);
router.post('/become-writer', protect, becomeWriter);
export default router;
