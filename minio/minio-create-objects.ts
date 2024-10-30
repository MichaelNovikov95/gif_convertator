import minioClient from './minio-connect.js';

const bucketName = "second-bucket";

(async () => {
  const objectName = "file.txt";
  const result = await minioClient
    .putObject(bucketName, objectName, "Hello There!")
    .catch((e) => {
      console.log("Error while creating object: ", e);
      throw e;
    });

  console.log("Object uploaded successfully: ", result);
})();
