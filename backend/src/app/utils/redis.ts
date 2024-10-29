// import IORedis from "ioredis";

// const redisConnection = new Redis({
//   host: "redis",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// export { redisConnection };

import IORedis from "ioredis";

const redisConnection = new IORedis({
  maxRetriesPerRequest: null,
});

export { redisConnection };
