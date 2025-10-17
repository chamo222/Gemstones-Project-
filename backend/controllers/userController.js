import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Creating a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// User register route
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
        if (password.length < 8) return res.json({ success: false, message: "Password too short" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User login route
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin login route
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, "name email createdAt"); // only needed fields
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};

// Setup transporter for sending offer emails
const transporter = nodemailer.createTransport({
    service: "gmail", // or your provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send bulk offer emails
const sendOfferEmails = async (req, res) => {
    const { emails, message } = req.body;

    if (!emails || emails.length === 0 || !message) {
        return res.status(400).json({ success: false, message: "Emails and message are required" });
    }

    try {
        for (const email of emails) {
            await transporter.sendMail({
                from: `"Your Store" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Special Offer",
                text: message,
            });
        }
        res.status(200).json({ success: true, message: "Offer emails sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to send emails" });
    }
};

export {
    registerUser,
    loginUser,
    adminLogin,
    getAllUsers,
    sendOfferEmails
};