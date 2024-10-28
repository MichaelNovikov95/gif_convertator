import { Request, Response } from "express";
import { videoQueue } from "../queue";

export const convertVideo = async (req: Request, res: Response) => {
  const file: Express.Multer.File | undefined = req.file;

  if (file) {
    const job = await videoQueue.add({ videoPath: file.path });

    res.status(202).send({ jobId: job.id, message: "Video conversion started.", status: "waiting" });
  } else {
    res.status(400).send("No file uploaded.");
  }
};
