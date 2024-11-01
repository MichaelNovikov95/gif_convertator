import { Request, Response } from "express";
import fs from "fs";
import { Queue } from "bullmq";

export const getGif = (videoQueue: Queue) => {
  return async (req: Request, res: Response): Promise<void> => {
    const jobId = req.params.id;

    try {
      const job = await videoQueue.getJob(jobId);

      if (!job) {
        res.status(404).send("Job not found.");
        return;
      }

      const outputPath = job.data.videoPath;
      const gifBuffer = fs.readFileSync(outputPath);
      const gifBase64 = gifBuffer.toString("base64");

      res.status(200).json({ gifBase64 });

      fs.unlink(outputPath, (unlinkErr) => {
        if (!unlinkErr) {
          console.log(`Deleted GIF file: ${outputPath}`);
          return;
        }
        console.error("Error deleting file:", unlinkErr);
      });
    } catch (error: any) {
      console.error("Error retrieving job status:", error);
      res.status(500).send(error.message);
    }
  };
};
