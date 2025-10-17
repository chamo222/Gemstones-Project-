import Notification from "../models/notificationModel.js";

export const createNotification = async (type, message, io) => {
  const notification = new Notification({ type, message });
  await notification.save();

  // Emit to all connected admins
  io.emit("new_notification", notification);
};