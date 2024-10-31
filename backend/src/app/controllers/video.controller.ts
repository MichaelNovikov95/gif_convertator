import { Request, Response } from "express";
import { Queue } from "bullmq";

export const convertVideo =
  (videoQueue: Queue) => async (req: Request, res: Response) => {
    const file: Express.Multer.File | undefined = req.file;

    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const job = await videoQueue.add("convert", { videoPath: file.path });

    res.status(202).send({
      jobId: job.id,
      message: "Video conversion started.",
      status: "waiting",
    });
  };
