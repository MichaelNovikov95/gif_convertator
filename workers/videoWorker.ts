// import { Worker, Job } from "bullmq";
// import { redisConnection } from "./utils/redis";
// import { convertVideoToGIF } from "./services/video.service";

// const worker = new Worker(
//   "videoQueue",
//   async (job: Job) => {
//     const { videoPath } = job.data;

//     try {
//       console.log(`Processing video: ${videoPath}`);

//       if (!job.id) return;

//       const gifPath = await convertVideoToGIF(videoPath);

//       await redisConnection.set(
//         job.id,
//         JSON.stringify({ status: "completed", outputPath: gifPath })
//       );

//       console.log(`Video converted to GIF: ${gifPath}`);

//       return gifPath;
//     } catch (error: any) {
//       console.error("Error processing job:", error);

//       if (!job.id) return;

//       await redisConnection.set(
//         job.id,
//         JSON.stringify({ status: "failed", error: error.message })
//       );

//       throw error;
//     }
//   },
//   { connection: redisConnection }
// );

// export default worker;

import { Worker, Job } from "bullmq";
import { redisConnection } from "./utils/redis";
import { convertVideoToGIF } from "./services/video.service";

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

      return gifPath;
    } catch (error: any) {
      console.error("Error processing job:", error);

      if (!job.id) return;

      await redisConnection.set(
        job.id,
        JSON.stringify({ status: "failed", error: error.message })
      );

      throw error;
    }
  },
  { connection: redisConnection }
);

export default worker;
