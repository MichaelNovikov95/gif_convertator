import { Worker, Job } from 'bullmq';
import { convertVideoToGIF } from "./services/video.service";
import { Redis } from 'ioredis';
import fs from 'fs';
import path from 'path';

const redisConnection = new Redis();
const videoQueue = new Queue('videoQueue', { connection: redisConnection });

const worker = new Worker('videoQueue', async (job: Job) => {
  if (job.name === 'inProgress') {
    console.log(`Job ${job.id} is already in progress. Skipping.`);
    return;
  }

  const { videoPath } = job.data;

  try {
    console.log(`Processing video: ${videoPath}`);

    await job.updateProgress(0);
    job.name = 'inProgress';

    const gifPath = await convertVideoToGIF(videoPath);

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, path.basename(gifPath));
    fs.renameSync(gifPath, outputPath);

    console.log(`Video processed: ${outputPath}`);

    await job.updateProgress(100);
    job.name = 'done';
    return outputPath;
  } catch (error) {
    console.error("Error processing job:", error);
    throw error;
  }
});

worker.on('completed', async (job: Job) => {
  console.log(`Job ${job.id} completed with result: ${job.returnvalue}`);

  const outputPath = job.returnvalue as string;
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath); // Видалення GIF після відправлення на фронтенд
    console.log(`File ${outputPath} has been deleted.`);
  }
});

worker.on('failed', (job: Job, err: Error) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

worker.on('progress', (job: Job, progress: number | object) => {
  console.log(`Job ${job.id} progress:`, progress);
});

worker.on('error', (err: Error) => {
  console.error("Worker error:", err);
});

async function restoreJobs() {
  const jobs = await videoQueue.getJobs(['waiting', 'paused', 'failed']);

  for (const job of jobs) {
    if (job.name === 'convert' && job.data.videoPath) {
      console.log(`Restoring job: ${job.id}, videoPath: ${job.data.videoPath}`);
      await videoQueue.add('convert', { videoPath: job.data.videoPath });
    }
  }
}

restoreJobs().catch(err => console.error("Error restoring jobs:", err));
