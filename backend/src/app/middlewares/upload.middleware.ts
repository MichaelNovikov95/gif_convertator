import multer, { Multer, StorageEngine } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir: string = path.join("/temp-storage");
    cb(null, dir);
  },
  filename: (_, __, cb) => {
    cb(null, `${Math.random().toString(16).slice(2)}.mp4`);
  },
});

export const upload: Multer = multer({ storage: storage });
