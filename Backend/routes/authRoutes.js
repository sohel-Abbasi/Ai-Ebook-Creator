import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
