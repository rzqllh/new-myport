import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

function getRedis() {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redis = null;
    return redis;
  }

  redis = new Redis({ url, token });
  return redis;
}

export async function checkChatRateLimits(ip: string) {
  const client = getRedis();

  if (!client) {
    return {
      configured: false,
      success: process.env.NODE_ENV !== "production",
    };
  }

  const perIp = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "portfolio:chat:ip",
  });

  const global = new Ratelimit({
    redis: client,
    limiter: Ratelimit.fixedWindow(500, "1 d"),
    prefix: "portfolio:chat:global",
  });

  const [globalResult, ipResult] = await Promise.all([
    global.limit("all"),
    perIp.limit(ip),
  ]);

  return {
    configured: true,
    success: globalResult.success && ipResult.success,
  };
}

export async function checkContactRateLimit(ip: string) {
  const client = getRedis();

  if (!client) {
    return {
      configured: false,
      success: true,
    };
  }

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "portfolio:contact:ip",
  });

  const result = await limiter.limit(ip);

  return {
    configured: true,
    success: result.success,
  };
}
