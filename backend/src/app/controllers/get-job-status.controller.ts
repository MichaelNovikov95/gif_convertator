import { redisConnection } from "../utils/redis";
import { Request, Response } from "express";

export const getJobStatus = async (req: Request, res: Response) => {
  const jobId = req.params.id;

  try {
    const jobStatus = await redisConnection.get(jobId);
    if (!jobStatus) {
      return res.status(404).send("Job not found.");
    }

    let parsedStatus;
    try {
      parsedStatus = JSON.parse(jobStatus);
    } catch (parseError) {
      console.error("Error parsing job status:", parseError);
      return res.status(500).send("Error retrieving job status.");
    }

    res.send({
      id: jobId,
      status: parsedStatus.status,
      outputPath: parsedStatus.outputPath,
    });
  } catch (error) {
    console.error("Error retrieving job status:", error);
    res.status(500).send("Error retrieving job status.");
  }
};
