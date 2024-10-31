import { Router } from "express";
import { Queue } from "bullmq";

import { upload } from "../middlewares/upload.middleware";
import { convertVideo } from "../controllers/video.controller";
import { getGif } from "../controllers/gif.controller";
import { getJobStatus } from "../controllers/get-job-status.controller";

export const videoRoutes = (videoQueue: Queue) => {
  const router = Router();

  router.post("/convert", upload.single("video"), convertVideo(videoQueue));
  router.get("/gif/:id", getGif(videoQueue));
  router.get("/job-status/:id", getJobStatus(videoQueue));

  return router;
};
