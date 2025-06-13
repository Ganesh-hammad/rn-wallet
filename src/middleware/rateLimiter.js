// rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";

const rateLimiter = async (req, res, next) => {
  try {
    // Optionally, you can use the IP or user ID as the key
    const identifier = req.ip || "global"; 

    const { success } = await Ratelimit.limit(identifier);

    if(!success){
      return res.status(429).json({
        message: "Too many requests, please try again later!",
      });
    }

    next();
  } catch (error) {
    console.error("RateLimit Error:", error);
    next(error);
  }
};

export default rateLimiter;
