// import express from "express";
// import cors from "cors";
// import multer, { diskStorage } from "multer";
// import ffmpeg, { setFfprobePath, ffprobe } from "fluent-ffmpeg";
// import { path as _path } from "@ffprobe-installer/ffprobe";
// import { join } from "path";
// import { existsSync, mkdirSync, unlinkSync } from "fs";

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());

// const storage = diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (_, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// if (!existsSync("uploads")) {
//   mkdirSync("uploads");
// }

// setFfprobePath(_path);

// app.post("/convert", upload.single("video"), (req, res) => {
//   const videoPath = req.file.path;
//   const gifPath = join("uploads", `output-${Date.now()}.gif`);

//   ffprobe(videoPath, (err, metadata) => {
//     if (err) {
//       console.error("Error processing video metadata:", err);
//       return res.status(500).send("Error processing video metadata.");
//     }

//     const { width, height, duration } = metadata.streams[0];
//     if (width > 1024 || height > 768 || duration > 10) {
//       return res
//         .status(400)
//         .send("Video must be 1024x768 or smaller and 10 seconds or less.");
//     }

//     ffmpeg(videoPath)
//       .output(gifPath)
//       .withFps(5)
//       .size("400x?")
//       .on("end", () => {
//         res.download(gifPath, (err) => {
//           if (err) {
//             console.error("Error downloading the GIF:", err);
//             return res.status(500).send("Error downloading the GIF.");
//           }
//           unlinkSync(videoPath);
//           unlinkSync(gifPath);
//         });
//       })
//       .on("error", (err) => {
//         console.error("Error converting video to GIF:", err);
//         return res.status(500).send("Error converting video to GIF.");
//       })
//       .run();
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
