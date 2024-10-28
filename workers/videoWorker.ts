import { videoQueue } from '../backend/src/queue';
import { convertVideoToGIF } from '../backend/src/services/video.service';
import fs from 'fs';
import path from 'path';

videoQueue.process(async (job) => {
  const { videoPath } = job.data;

  try {
    console.log(`Processing video: ${videoPath}`);

    const gifPath = await convertVideoToGIF(videoPath);

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, path.basename(gifPath));
    fs.renameSync(gifPath, outputPath);

    console.log(`Video processed: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error processing job:", error);
    throw error;
  }
});

videoQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

videoQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});
