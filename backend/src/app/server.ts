import express from "express";
import cors from "cors";
import { videoRoutes } from "./routes/video.router";
import worker from "../../../workers/videoWorker";
import videoQueue from "../../../utils/videoQueue";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", () => {
  console.log("checks");
});
app.use("/api/videos", videoRoutes(videoQueue));

worker;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
