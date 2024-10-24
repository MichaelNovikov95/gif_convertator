import { Router } from "express";

import { convertVideo } from "../controllers/video.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/convert", upload.single("video"), convertVideo);

export const videoRoutes = router;
