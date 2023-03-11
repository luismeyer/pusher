import { readFileSync } from "fs";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const { VIDEO_BUCKET } = process.env;
if (!VIDEO_BUCKET) {
  throw new Error("VIDEO_BUCKET is not defined");
}

const region = "eu-central-1";
const client = new S3Client({ region });

export const uploadFileToS3 = async (filePath: string) => {
  const key = "video.mp4";

  const command = new PutObjectCommand({
    Bucket: process.env.VIDEO_BUCKET,
    Key: key,
    Body: readFileSync(filePath),
  });

  return client
    .send(command)
    .then(() => `https://${VIDEO_BUCKET}.s3.${region}.amazonaws.com/${key}`);
};
