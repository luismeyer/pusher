import { readFileSync } from "fs";

import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { createBucketUrl } from "@pusher/shared";

const { BUCKET_NAME } = process.env;
if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME is not defined");
}

const region = process.env.REGION ?? "eu-central-1";

const localConfig: S3ClientConfig = {
  forcePathStyle: true,
  endpoint: "http://localhost:3001",
  region,
  credentials: {
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
  },
};

const client = new S3Client(process.env.IS_LOCAL ? localConfig : { region });

export const uploadFileToS3 = async (filePath: string, flowId: string) => {
  const key = flowId;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: readFileSync(filePath),
  });

  return client
    .send(command)
    .then(() => createBucketUrl(BUCKET_NAME, key))
    .catch((error: Error) => {
      console.info("Error in s3 upload:", error.message);

      return undefined;
    });
};
