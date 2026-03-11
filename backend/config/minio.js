import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || "drivex-storage";