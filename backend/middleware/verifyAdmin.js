import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await userModel.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    req.user = adminUser; // attach admin info to request
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};