import { Request, Response } from "express";

import { convertVideoToGIF } from "../services/video.service";

export const convertVideo = async (req: Request, res: Response) => {
  const file: Express.Multer.File | undefined = req.file;

  if (file) {
    try {
      const gifPath: string = await convertVideoToGIF(file.path);

      res.download(gifPath, (err) => {
        if (err) {
          console.error("Error downloading the GIF:", err);
          return res.status(500).send("Error downloading the GIF.");
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("An unknown error occurred.");
      }
    }
  } else {
    res.status(400).send("No file uploaded.");
  }
};
