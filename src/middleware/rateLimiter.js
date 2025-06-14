// src/middleware/rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "dotenv/config"; // Make sure this is somewhere in your server entry

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(500, "10 s"),
});

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip || "global";
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later!",
      });
    }
    next();
  } catch (error) {
    console.error("RateLimiter Error:", error);
    res.status(500).json({ success: false, message: "Rate limiter failed" });
  }
};

export default rateLimiter;
