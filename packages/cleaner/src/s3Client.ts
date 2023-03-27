import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

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

export const s3Client = new S3Client(
  process.env.IS_LOCAL ? localConfig : { region }
);
