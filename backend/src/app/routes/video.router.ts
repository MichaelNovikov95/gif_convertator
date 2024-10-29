import { Router } from "express";
import { convertVideo } from "../controllers/video.controller";
import { getGif } from "../controllers/gif.controller";
import { upload } from "../middlewares/upload.middleware";
import { Queue } from "bullmq";
import { getJobStatus } from "../controllers/get-job-status.controller";

export const videoRoutes = (videoQueue: Queue) => {
  const router = Router();

  router.post("/convert", upload.single("video"), convertVideo(videoQueue));
  router.get("/gif/:id", getGif);
  router.get("/job-status/:id", getJobStatus);

  return router;
};
