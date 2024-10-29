import multer from "multer";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join(__dirname, "../data/files"); // Вказуємо на директорію, яка монтується в Nginx
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true }); // Створюємо директорію, якщо її немає
    }
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
