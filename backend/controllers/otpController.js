import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { setOTP, verifyOTP } from "../utils/otpHelper.js";
import transporter from "../config/emailConfig.js";

/* ------------------------- 1️⃣ Signup: Send OTP ------------------------- */
export const signupRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "All fields required" });

    const exists = await userModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setOTP(email, otp);

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your B Sirisena Holdings account",
      html: `
        <div style="font-family:sans-serif;padding:16px;background:#fff;">
          <h2 style="color:#333;">Email Verification</h2>
          <p>Hi ${name},</p>
          <p>Your OTP for account verification is:</p>
          <h1 style="letter-spacing:4px;color:#007BFF;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Signup Request Error:", err);
    res.json({ success: false, message: err.message });
  }
};

/* ------------------------- 2️⃣ Signup: Verify OTP ------------------------- */
export const signupVerify = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!email || !otp)
      return res.json({ success: false, message: "Email and OTP required" });

    const valid = await verifyOTP(email, otp);
    if (!valid)
      return res.json({ success: false, message: "Invalid or expired OTP" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    if (!name || !password)
      return res.json({ success: false, message: "Missing name or password" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const saved = await newUser.save();

    const token = jwt.sign({ id: saved._id }, process.env.JWT_SECRET);

    /* ✅ Send Welcome Email after successful account creation */
    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to B Sirisena Holdings!",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;border-radius:10px;">
          <h2 style="color:#2c3e50;">Welcome, ${name}! 💎</h2>
          <p>Thank you for joining <strong>B Sirisena Holdings</strong>.</p>
          <p>We’re thrilled to have you as part of our gemstone community. Explore our exclusive collection and enjoy your shopping journey!</p>
          <br/>
          <a href="https://gemstonesproject.netlify.app/" 
             style="display:inline-block;padding:10px 20px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">
             Visit B Sirisena Holdings
          </a>
          <br/><br/>
          <p style="font-size:12px;color:#777;">If you didn’t create this account, please contact our support team.</p>
        </div>
      `,
    });

    res.json({ success: true, token, message: "Account created successfully" });
  } catch (err) {
    console.error("Signup Verify Error:", err);
    res.json({ success: false, message: err.message });
  }
};

/* ------------------------- 3️⃣ Forgot Password: Request OTP ------------------------- */
export const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Email required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "No account with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await setOTP(email, otp);

    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family:sans-serif;padding:16px;background:#fff;">
          <h2>Password Reset</h2>
          <p>Hi ${user.name || "user"},</p>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing:4px;color:#d9534f;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password Request Error:", err);
    res.json({ success: false, message: err.message });
  }
};

/* ------------------------- 4️⃣ Forgot Password: Verify OTP + Reset ------------------------- */
export const forgotPasswordVerify = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.json({ success: false, message: "Email, OTP, and new password required" });

    const valid = await verifyOTP(email, otp);
    if (!valid)
      return res.json({ success: false, message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

    /* ✅ Optional: Send confirmation email for password reset */
    await transporter.sendMail({
      from: `"B Sirisena Holdings" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your B Sirisena Holdings password was reset",
      html: `
        <div style="font-family:sans-serif;padding:16px;background:#fff;">
          <h2>Password Reset Successful</h2>
          <p>Hi, your password has been successfully changed.</p>
          <p>If you didn’t make this change, please contact our support team immediately.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Forgot Password Verify Error:", err);
    res.json({ success: false, message: err.message });
  }
};