import ffmpeg from "fluent-ffmpeg";
import { join } from "path";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import fs from "fs";

ffmpeg.setFfprobePath(ffprobePath);

export const convertVideoToGIF = (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const gifPath = join(
      "/temp-storage",
      `output-${Math.random().toString(16).slice(2)}.gif`
    );

    ffmpeg(videoPath)
      .output(gifPath)
      .withFps(5)
      .size("400x?")
      .on("end", () => {
        console.log(`Video converted to GIF: ${gifPath}`);
        resolve(gifPath);
        fs.unlink(videoPath, (error) => {
          if (!error) return;
          console.log(error.message);
        });
      })
      .on("error", (err) => {
        console.error("Error converting video to GIF:", err);
        reject(new Error("Error converting video to GIF."));
      })
      .run();
  });
};
