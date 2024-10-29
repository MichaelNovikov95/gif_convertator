import { Redis } from "../backend/node_modules/ioredis/built";

const redisConnection = new Redis();

export { redisConnection };
