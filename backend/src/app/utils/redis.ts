import IORedis from "ioredis";

const redisConnection = new IORedis({
  host: "0.0.0.0",
  port: 6379,
  maxRetriesPerRequest: null,
});

export { redisConnection };
