import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis URL or Token in environment variables");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ✅ Named exports
export const setOTP = async (email, otp) => {
  await redis.set(`otp:${email}`, otp, { ex: 300 }); // 5 min expiration
};

export const verifyOTP = async (email, otp) => {
  const storedOtp = await redis.get(`otp:${email}`);
  return storedOtp && storedOtp.toString() === otp.toString();
};