import ffmpeg from "fluent-ffmpeg";
import { join } from "path";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";

ffmpeg.setFfprobePath(ffprobePath);

export const convertVideoToGIF = (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const gifPath = join("uploads", `output-${Date.now()}.gif`);

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("Error processing video metadata:", err);
        return reject(new Error("Error processing video metadata."));
      }

      const stream = metadata.streams[0];

      if (
        !stream ||
        typeof stream.width !== "number" ||
        typeof stream.height !== "number" ||
        typeof stream.duration !== "number"
      ) {
        return reject(new Error("Invalid video metadata."));
      }

      const width = stream.width;
      const height = stream.height;
      const duration = parseFloat(stream.duration);

      if (width > 1024 || height > 768 || duration > 10) {
        return reject(
          new Error("Video must be 1024x768 or smaller and 10 seconds or less.")
        );
      }

      ffmpeg(videoPath)
        .output(gifPath)
        .withFps(5)
        .size("400x?")
        .on("end", () => {
          resolve(gifPath);
        })
        .on("error", (err) => {
          console.error("Error converting video to GIF:", err);
          reject(new Error("Error converting video to GIF."));
        })
        .run();
    });
  });
};
