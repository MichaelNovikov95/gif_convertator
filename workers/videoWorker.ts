import { Worker, Job, Queue } from "bullmq";
import { redisConnection } from "./utils/redis";
import { convertVideoToGIF } from "./services/video.service";

const videoQueue = new Queue("videoQueue", { connection: redisConnection });

const worker = new Worker(
  "videoQueue",
  async (job: Job) => {
    const { videoPath } = job.data;

    try {
      console.log(`Processing video: ${videoPath}`);

      if (!job.id) return;

      const gifPath = await convertVideoToGIF(videoPath);

      await redisConnection.set(
        job.id,
        JSON.stringify({ status: "completed", outputPath: gifPath })
      );

      console.log(`Video converted to GIF: ${gifPath}`);
      return gifPath;
    } catch (error: any) {
      console.error("Error processing job:", error);
      if (job.id) {
        await redisConnection.set(
          job.id,
          JSON.stringify({ status: "failed", error: error.message })
        );
      }
      throw error;
    }
  },
  { connection: redisConnection }
);

async function restoreJobs() {
  const jobs = await videoQueue.getJobs(["waiting", "active", "completed"]);
  for (const job of jobs) {
    if (job.name === "convert" && job.data.videoPath) {
      console.log(`Restoring job: ${job.id}, videoPath: ${job.data.videoPath}`);
      await videoQueue.add("convert", { videoPath: job.data.videoPath });
    }
  }
}

restoreJobs().catch((err) => console.error("Error restoring jobs: ", err));

export default worker;
