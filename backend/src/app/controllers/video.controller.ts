import { Request, Response } from "express";
import { Queue } from 'bullmq';
import fs from 'fs';
import { redisConnection } from "../../../../utils/redis";

export const convertVideo = (videoQueue: Queue) => async (req: Request, res: Response) => {
  const file: Express.Multer.File | undefined = req.file;

  if (file) {
    const job = await videoQueue.add('convert', { videoPath: file.path });

    res.status(202).send({ jobId: job.id, message: "Video conversion started.", status: "waiting" });
  } else {
    res.status(400).send("No file uploaded.");
  }
};

export const getGif = async (req: Request, res: Response) => {
  const jobId = req.params.id;

  try {
    const jobStatus = await redisConnection.get(jobId);
    if (!jobStatus) {
      res.status(404).send("Job not found.");
      return;
    }

    const { outputPath } = JSON.parse(jobStatus);

    res.sendFile(outputPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).send("Error sending file.");
      }

      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log(`Deleted GIF file: ${outputPath}`);
        }
      });
    });
  } catch (error) {
    console.error("Error retrieving job status:", error);
    res.status(500).send("Error retrieving job status.");
  }
};
