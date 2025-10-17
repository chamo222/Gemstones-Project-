import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// Utility: Create nodemailer transporter
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Public: Send a new contact message
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: "All fields are required." });

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    const transporter = createTransporter();

    const htmlMessage = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(145deg, #fdfcf8, #f3f3f8);
        padding: 30px;
        border-radius: 15px;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          border: 1px solid #eee;
        ">
          <h2 style="color: #4169E1; text-align: center; margin-bottom: 20px; font-size: 28px;">💎 New Message Received</h2>
          <p style="text-align: center; color: #555; font-size: 16px;">You received a new message from your website contact form.</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          <div style="padding: 10px 0;">
            <h3 style="color: #222; margin-bottom: 8px;">Sender Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div style="padding: 10px 0; background: #f9f9fc; border-radius: 10px; margin-top: 15px;">
            <h3 style="color: #222; margin-bottom: 8px;">Message:</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          <p style="font-size: 12px; text-align: center; color: #888; margin-top: 25px;">
            Sent automatically from <strong>B Sirisena Holdings</strong> website
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `💬 New Contact Message from ${name}`,
      html: htmlMessage,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Admin: Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

// Admin: Reply to a message
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ error: "Reply cannot be empty." });

    const message = await Contact.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found." });

    message.reply = reply;
    message.repliedAt = new Date();
    await message.save();

    const transporter = createTransporter();

    const htmlReply = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(145deg, #fdfcf8, #f3f3f8);
        padding: 30px;
        border-radius: 15px;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          border: 1px solid #eee;
        ">
          <h2 style="color: #4169E1; text-align: center; margin-bottom: 20px; font-size: 28px;">💎 Reply from B Sirisena Holdings</h2>
          <p><strong>Hi ${message.name},</strong></p>
          <p style="line-height: 1.6; margin-bottom: 20px;">${reply}</p>
          <p> B Sirisena Holdings</p>
          <p style="font-size: 12px; text-align: center; color: #888; margin-top: 20px;">
            Reply sent on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: message.email,
      subject: "💌 Reply to your message",
      html: htmlReply,
    });

    res.status(200).json({ message: "Reply sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reply." });
  }
};

// Admin: Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete message." });
  }
};

// NEW: Get unread message count for header notification
export const getUnreadCount = async (req, res) => {
  try {
    // Messages without a reply are considered unread
    const count = await Contact.countDocuments({ reply: { $exists: false } });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Failed to get unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread messages count." });
  }
};