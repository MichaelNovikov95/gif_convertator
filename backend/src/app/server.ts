import express, { Express } from "express";
import cors from "cors";
import { Queue } from "bullmq";

import { videoRoutes } from "./routes/video.router";
import { redisConnection } from "./utils/redis";

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

const videoQueue = new Queue("videoQueue", { connection: redisConnection });

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Server is responding.</h1>");
});
app.use("/api/videos", videoRoutes(videoQueue));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
