import { Worker, Job, Queue, FlowProducer } from 'bullmq';
import { Redis } from 'ioredis';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { convertVideoToGIF } from "../backend/src/app/services/video.service";

const redisConnection = new Redis();
const videoQueue = new Queue('videoQueue', { connection: redisConnection });
const flowProducer = new FlowProducer({ connection: redisConnection });
const app = express();
const PORT = process.env.PORT || 3000;

const worker = new Worker('videoQueue', async (job: Job) => {
  const { videoPath } = job.data;

  try {
    console.log(`Processing video: ${videoPath}`);

    const flow = await flowProducer.add({
      name: 'convertVideoFlow',
      queueName: 'videoConversionQueue',
      children: [
        {
          name: 'convertToGIF',
          data: { videoPath }
        }
      ]
    });

    console.log(`Flow created with ID: ${flow.id}`);
    return flow.id;
  } catch (error) {
    console.error("Error processing job:", error);
    throw error;
  }
});

const conversionWorker = new Worker('videoConversionQueue', async (job: Job) => {
  const { videoPath } = job.data;

  try {
    console.log(`Converting video to GIF: ${videoPath}`);

    const gifPath = await convertVideoToGIF(videoPath);
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, path.basename(gifPath));
    fs.renameSync(gifPath, outputPath);

    console.log(`Video converted: ${outputPath}`);

    await redisConnection.set(job.id, JSON.stringify({ status: 'completed', outputPath }));

    return outputPath;
  } catch (error) {
    console.error("Error converting video:", error);
    await redisConnection.set(job.id, JSON.stringify({ status: 'failed', error: error.message }));
    throw error;
  }
});

worker.on('completed', async (job: Job) => {
  console.log(`Job ${job.id} completed with flow ID: ${job.returnvalue}`);
});

worker.on('failed', (job: Job, err: Error) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

conversionWorker.on('completed', async (job: Job) => {
  console.log(`Conversion job ${job.id} completed with result: ${job.returnvalue}`);
});

conversionWorker.on('failed', (job: Job, err: Error) => {
  console.log(`Conversion job ${job.id} failed: ${err.message}`);
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

app.get('/api/videos/gif/:id', async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

restoreJobs().catch(err => console.error("Error restoring jobs:", err));
