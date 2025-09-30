import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import decompress from "decompress";
import { existsSync, writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { BUCKET_NAME, IS_LOCAL, LINUX_FFMPEG_URL, MAC_FFMPEG_URL } = process.env;

if (!LINUX_FFMPEG_URL) {
  throw new Error("Missing LINUX_FFMPEG_URL");
}

if (!MAC_FFMPEG_URL) {
  throw new Error("Missing MAC_FFMPEG_URL");
}

const url = IS_LOCAL ? MAC_FFMPEG_URL : LINUX_FFMPEG_URL;

const tmpPath = resolve(__dirname, "../tmp/");

const client = new S3Client({
  region: "eu-central-1",
});

const s3Key = "ffmpeg";

const uploadToS3 = async (data) => {
  console.info("Uploading ffmpeg to S3");

  return client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: Buffer.from(data),
    }),
  );
};

const existsInS3 = async () => {
  console.info("Checking if ffmpeg exists in S3");

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
      }),
    );

    console.info("ffmpeg exists in S3");
    return true;
  } catch (e) {
    console.info("ffmpeg not found in S3", e);

    return false;
  }
};

const fetchArchive = async () => {
  console.info(`Downloading ffmpeg archive from ${url}`);

  const archiveFilename = url.split("/").pop();
  if (!archiveFilename) {
    throw new Error("Missing filename");
  }

  const archivePath = `/tmp/${archiveFilename}`;

  if (existsSync(archivePath)) {
    console.info("Archive already exists");
    return archivePath;
  }

  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => writeFileSync(archivePath, Buffer.from(data)))
    .then(() => archivePath);
};

const decompressArchive = async (archivePath) => {
  console.info("Decompressing ffmpeg archive");

  return decompress(archivePath, tmpPath).then(async (files) => {
    console.info("Decompress done!");

    const file = files.find(({ path }) => path.endsWith("ffmpeg"));

    if (!file) {
      throw new Error("Missing ffmpeg file");
    }

    return file;
  });
};

const loadFFMPEG = async () => fetchArchive().then(decompressArchive);

const runCi = async () => {
  if (!BUCKET_NAME) {
    throw new Error("Missing BUCKET_NAME");
  }

  const exists = await existsInS3();
  if (BUCKET_NAME && exists) {
    return;
  }

  const file = await loadFFMPEG();

  await uploadToS3(file.data);

  console.info("Done! ffmpeg file uploaded to S3");
};

const runLocal = async () => {
  const path = resolve(tmpPath, "ffmpeg");

  if (existsSync(path)) {
    console.info("ffmpeg File already exists");
    return;
  }

  const file = await loadFFMPEG();

  writeFileSync(path, file.data);

  console.info(`Done! ffmpeg file written to ${path}`);
};

const main = async () => {
  if (IS_LOCAL) {
    console.info("Running local setup...");

    runLocal();
  }

  if (!IS_LOCAL) {
    console.info("Running CI setup...");

    runCi();
  }
};

main();
