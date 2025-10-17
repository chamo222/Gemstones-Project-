import express from "express";
import {
  sendContactMessage,
  getAllMessages,
  replyToMessage,
  deleteMessage,
  getUnreadCount,
} from "../controllers/contactController.js";

const router = express.Router();

// Public route
router.post("/contact", sendContactMessage);

// Admin routes (could be protected later with auth middleware)
router.get("/contact/all", getAllMessages);
router.post("/contact/reply/:id", replyToMessage);
router.delete("/contact/:id", deleteMessage);

// NEW: Get unread message count
router.get("/contact/unread-count", getUnreadCount);

export default router;