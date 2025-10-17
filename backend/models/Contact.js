import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String, default: "" },       // Admin reply
  repliedAt: { type: Date },                  // Timestamp of reply
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);