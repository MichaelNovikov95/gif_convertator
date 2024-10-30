import express from "express";
import cors from "cors";
import { videoRoutes } from "./routes/video.router";
import { Queue } from "bullmq";
import { redisConnection } from "./utils/redis";
// import worker from "../../../workers/videoWorker";

const app = express();
const PORT = process.env.PORT || 3000;

// redisDemo();
const videoQueue = new Queue("videoQueue", { connection: redisConnection });

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Henlo</h1>");
});
app.use("/api/videos", videoRoutes(videoQueue));

// worker;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
