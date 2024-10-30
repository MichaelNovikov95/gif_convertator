import { Request, Response } from "express";
import { Queue } from "bullmq";
import fs from "fs";
import multer from "multer";

export const convertVideo =
  (videoQueue: Queue) => async (req: Request, res: Response) => {
    const file = req.file as any;
    const filePath = `/temporary-storage/${Math.random()
      .toString(16)
      .slice(2)}.mp4`;

    if (file) {
      fs.writeFileSync(filePath, file, "binary");

      const job = await videoQueue.add("convert", { videoPath: filePath });

      res.status(202).send({
        jobId: job.id,
        message: "Video conversion started.",
        status: "waiting",
      });
    } else {
      res.status(400).send("No file uploaded.");
    }
  };

//   import * as fs from 'fs'
// import * as path from 'path'

// import { config } from '@app/config/cabinet-api'
// import { CommonExceptionReason, Exception } from '@app/core/interfaces/exceptions'
// import { FileBase64Data, TemporaryStorageFileInfo } from '@app/types/document/interfaces/files'
// import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

// @Injectable()
// export class TemporaryStorageService {
//   private logger = new Logger(TemporaryStorageService.name)

//   private temporaryStorageDir = config.get('temporaryStorageDir')

//   setToTemporaryStorage(files: FileBase64Data[]): TemporaryStorageFileInfo[] {
//     return files.map((item: FileBase64Data) => {
//       const fileName = item.fileName.trim()
//       const content = Buffer.from(item.contentBase64, 'base64')
//       const now = Date.now()

//       try {
//         const filePath = path.join(this.temporaryStorageDir, ${fileName}-${now})

//         fs.writeFileSync(filePath, content)

//         return { fileName, filePath }
//       } catch {
//         this.logger.error({
//           msg: File: ${fileName} could not set into temporary storage,
//           service: ${TemporaryStorageService.name}.setToTemporaryStorage,
//         })

//         throw new InternalServerErrorException(<Exception>{
//           reason: CommonExceptionReason.InternalServerError,
//           message: File: ${fileName} could not set into temporary storage,
//         })
//       }
//     })
//   }
// }
