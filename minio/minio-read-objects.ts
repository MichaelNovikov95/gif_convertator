import fs from 'fs';
import minioClient from './minio-connect.js';

const bucketName = "second-bucket";

(async () => {
  const fileStream = fs.createWriteStream("./read-in-chunks.txt");
  const fileObjectKey = "file-object.txt";

  const object = await minioClient.getObject(bucketName, fileObjectKey);
  object.on("data", (chunk) => fileStream.write(chunk));

  object.on("end", () => console.log(`Reading ${fileObjectKey} finished`));
})();
