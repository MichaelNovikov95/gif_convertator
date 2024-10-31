import IORedis from "ioredis";

const redisConnection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redisConnection.on("error", (err: Error) => {
  console.error("Error connecting to Redis:", err);
});

export { redisConnection };
