import express from "express";
import cors from "cors";
import { videoRoutes } from "./routes/video.router";
import { Redis } from 'ioredis';
import { Queue } from 'bullmq';

const app = express();
const PORT = process.env.PORT || 3000;

const redisConnection = new Redis();
const videoQueue = new Queue('videoQueue', { connection: redisConnection });

app.use(cors());
app.use(express.json());
app.get("/", () => {
  console.log("checks");
});
app.use("/api/videos", videoRoutes(videoQueue));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
