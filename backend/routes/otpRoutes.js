import express from "express";
import {
  signupRequest,
  signupVerify,
  forgotPasswordRequest,
  forgotPasswordVerify,
} from "../controllers/otpController.js";

const router = express.Router();

// Signup routes
router.post("/signup-request", signupRequest);
router.post("/signup-verify", signupVerify);

// Forgot password routes
router.post("/forgot-password-request", forgotPasswordRequest);
router.post("/forgot-password-verify", forgotPasswordVerify);

export default router;