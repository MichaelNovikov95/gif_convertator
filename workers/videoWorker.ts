import { Worker, Job, Queue } from "bullmq";
import { redisConnection } from "../utils/redis.js";
import { convertVideoToGIF } from "../backend/src/app/services/video.service";

const videoQueue = new Queue("videoQueue", { connection: redisConnection });

const worker = new Worker("videoQueue", async (job: Job) => {
  const { videoPath } = job.data;

  try {
    console.log(`Processing video: ${videoPath}`);

    const gifPath = await convertVideoToGIF(videoPath);

    if (job.id) {
      await redisConnection.set(
        job.id,
        JSON.stringify({ status: "completed", outputPath: gifPath })
      );
    }

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
});

worker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} completed with output: ${job.returnvalue}`);
});

worker.on("failed", (job: Job | undefined, err: Error) => {
  if (job) {
    console.log(`Job ${job.id} failed: ${err.message}`);
  } else {
    console.log(
      `A job failed, but the job information is undefined. Error: ${err.message}`
    );
  }
});

async function restoreJobs() {
  const jobs = await videoQueue.getJobs(["waiting", "paused", "failed"]);
  for (const job of jobs) {
    if (job.name === "convert" && job.data.videoPath) {
      console.log(`Restoring job: ${job.id}, videoPath: ${job.data.videoPath}`);
      await videoQueue.add("convert", { videoPath: job.data.videoPath });
    }
  }
}

restoreJobs().catch((err) => console.error("Error restoring jobs: ", err));

export default worker;
