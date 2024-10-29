import { Queue } from 'bullmq';
import { redisConnection } from './redis';

const videoQueue = new Queue('videoQueue', { connection: redisConnection });

export default videoQueue;
