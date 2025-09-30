import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import S3rver from "s3rver";

import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { Environment } from "../readEnv";

const directory = "/tmp/s3rver_test_directory";

const bucketName = process.env.BUCKET_NAME;
if (!bucketName) {
  throw new Error("BUCKET_NAME Env variable is not set");
}

const uploadFFMPEG = async (endpoint: string) => {
  const ffmpegData = readFileSync(resolve(__dirname, "../../../../tmp/ffmpeg"));

  const client = new S3Client({
    forcePathStyle: true,
    endpoint,
    region: "eu-central-1",
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
    },
  });

  const { bucketName } = Environment;

  if (!existsSync(resolve(directory, bucketName))) {
    await client.send(new CreateBucketCommand({ Bucket: bucketName }));
  }

  return client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "ffmpeg",
      Body: Buffer.from(ffmpegData),
    }),
  );
};

export const createS3Server = async () => {
  const s3Port = 3001;
  const s3Host = "localhost";

  const s3Server = new S3rver({
    port: s3Port,
    address: s3Host,
    silent: false,
    directory,
  });

  await s3Server.run();

  const endpoint = `http://${s3Host}:${s3Port}`;
  console.info(`S3rver running on ${endpoint}`);

  await uploadFFMPEG(endpoint);

  return () => s3Server.close();
};
