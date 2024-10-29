import { Router } from "express";
import { convertVideo } from "../controllers/video.controller";
import { getGif } from "../controllers/gif.controller";
// import { upload } from "../middlewares/upload.middleware";
import { Queue } from "bullmq";

export const videoRoutes = (videoQueue: Queue) => {
  const router = Router();

  router.post("/convert", convertVideo(videoQueue));
  router.get("/gif/:id", getGif);

  return router;
};
