import { Queue } from "bullmq";
import { Request, Response } from "express";
import fs from "fs/promises";

export const deleteAllGifs = (videoQueue: Queue) => {
  return async (req: Request, res: Response): Promise<void> => {
    const jobId = req.params.id;

    try {
      const job = await videoQueue.getJob(jobId);

      if (!job) {
        res.status(404).send(`Job with id ${jobId} not found.`);
        return;
      }

      const outputPath = job.data.videoPath;

      try {
        await fs.unlink(outputPath);
        console.log(`Deleted GIF file: ${outputPath}`);
      } catch (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      }

      res.status(200).send("All GIF files deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting GIFs:", error);
      res.status(500).send(error.message);
    }
  };
};
