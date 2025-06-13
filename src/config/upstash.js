
// upstash.js
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(4, "60 s"), // 4 requests per 60 seconds
  analytics: true,
});

export default ratelimit;
