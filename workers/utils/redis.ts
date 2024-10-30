import IORedis from "ioredis";

const redisConnection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

export { redisConnection };
