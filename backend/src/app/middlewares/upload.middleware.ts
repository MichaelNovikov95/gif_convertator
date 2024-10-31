import multer from "multer";

import path from "path";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join("/temp-storage");
    cb(null, dir);
  },
  filename: (_, __, cb) => {
    cb(null, `${Math.random().toString(16).slice(2)}.mp4`);
  },
});

export const upload = multer({ storage: storage });
