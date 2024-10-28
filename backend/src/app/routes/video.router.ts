import { Router } from "express";
import { convertVideo } from "../controllers/video.controller";
import { upload } from "../middlewares/upload.middleware";
import { Queue } from 'bullmq';

export const videoRoutes = (videoQueue: Queue) => {
  const router = Router();

  router.post("/convert", upload.single("video"), convertVideo(videoQueue));

  return router;
};
