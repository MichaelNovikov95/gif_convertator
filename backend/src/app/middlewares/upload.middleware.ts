import multer from "multer";
import { existsSync, mkdirSync } from "fs";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = "uploads/";
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
