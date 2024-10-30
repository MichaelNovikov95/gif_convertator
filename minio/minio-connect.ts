import 'dotenv/config';
import Minio from 'minio';

const minioClient = new Minio.Client({
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  endPoint: process.env.HOST,
  pathStyle: true,
});

console.log("MinIO client connected");

export default minioClient;
