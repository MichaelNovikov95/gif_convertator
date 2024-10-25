const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

module.exports = (on) => {
  on("task", {
    uploadVideo({ fileContent, videoFilePath, outputDir }) {
      const formData = new FormData();
      formData.append(
        "video",
        Buffer.from(fileContent, "binary"),
        videoFilePath
      );

      return axios({
        method: "POST",
        url: "http://localhost:3000/api/videos/convert",
        data: formData,
        headers: formData.getHeaders(),
        responseType: "arraybuffer",
      })
        .then((response) => {
          if (
            response.status === 200 &&
            response.headers["content-type"].includes("image/gif")
          ) {
            const gifFileName = `output-${Math.random()
              .toString(16)
              .slice(2)}.gif`;
            const gifPath = path.join(outputDir, gifFileName);

            fs.writeFileSync(gifPath, response.data, "binary");

            return { success: true, path: gifPath };
          } else {
            throw new Error("Unexpected response format");
          }
        })
        .catch((error) => {
          console.error("Error uploading video:", error);
          return { success: false, error: error.message };
        });
    },
  });
};
