import { Request, Response } from "express";
import fs from "fs";
import { redisConnection } from "../utils/redis";

export const getGif = async (req: Request, res: Response) => {
  const jobId = req.params.id;

  try {
    const jobStatus = await redisConnection.get(jobId);
    if (jobStatus) {
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
    } else {
      res.status(404).send("Job not found.");
    }
  } catch (error) {
    console.error("Error retrieving job status:", error);
    res.status(500).send("Error retrieving job status.");
  }
};
