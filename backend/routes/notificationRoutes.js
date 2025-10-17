import express from "express";
import Notification from "../models/notificationModel.js";

const router = express.Router();

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark all as read
router.put("/mark-read", async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

export default router;