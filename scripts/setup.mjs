import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import decompress from "decompress";
import decompressTarxz from "decompress-tarxz";
import decompressUnzip from "decompress-unzip";
import { existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import fetch from "node-fetch";

const { BUCKET_NAME, IS_LOCAL, LINUX_FFMPEG_URL, MAC_FFMPEG_URL } = process.env;

if (!LINUX_FFMPEG_URL) {
  throw new Error("Missing LINUX_FFMPEG_URL");
}

if (!MAC_FFMPEG_URL) {
  throw new Error("Missing MAC_FFMPEG_URL");
}

const getUrl = () => {
  const linuxUrl = LINUX_FFMPEG_URL;
  const macUrl = MAC_FFMPEG_URL;

  return IS_LOCAL ? macUrl : linuxUrl;
};

const uploadToS3 = async (data) => {
  const client = new S3Client({
    region: "eu-central-1",
  });

  return client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "ffmpeg",
      Body: Buffer.from(data),
    })
  );
};

const fetchArchive = async () => {
  const url = getUrl();

  console.info("Downloading ffmpeg archive from " + url);

  const filename = url.split("/").pop();

  if (!filename) {
    throw new Error("Missing filename");
  }

  const path = resolve("/tmp", filename);

  console.info("Saving ffmpeg archive to " + path);

  if (!existsSync(path)) {
    await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => writeFileSync(path, Buffer.from(buffer)));

    console.info("Downloaded ffmpeg archive into " + path);
  }

  decompress(path, "/tmp", {
    plugins: [decompressTarxz(), decompressUnzip()],
  }).then(async (files) => {
    console.log("decompress done!");

    const file = files.find(({ path }) => path.endsWith("ffmpeg"));

    if (!file) {
      throw new Error("Missing ffmpeg file");
    }

    if (file && !IS_LOCAL && BUCKET_NAME) {
      console.info("Uploading ffmpeg to S3");

      await uploadToS3(file.data);
    }
  });
};

fetchArchive();
