import fs from "fs";
import path from "path";

export const deleteTempFiles = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.error("Error reading directory:", err);
    }

    files.forEach((file) => {
      if (path.extname(file) !== ".gif") return;

      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {
        if (!err) {
          console.log("Deleted file:", filePath);
          return;
        }
        console.error("Error deleting file:", filePath, err);
      });
    });
  });
};
