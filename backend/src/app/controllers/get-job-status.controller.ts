import { Queue } from "bullmq";
import { Request, Response } from "express";

export const getJobStatus = (videoQueue: Queue) => {
  return async (req: Request, res: Response): Promise<void> => {
    const jobId = req.params.id;

    try {
      const job = await videoQueue.getJob(jobId);

      if (!job) {
        res.status(404).send("Job not found.");
        return;
      }

      const status = await job.getState();
      const outputPath = job.data;

      res.send({
        id: jobId,
        status,
        outputPath,
      });
    } catch (error) {
      console.error("Error retrieving job details:", error);
      res.status(500).send("Error retrieving job details.");
    }
  };
};
