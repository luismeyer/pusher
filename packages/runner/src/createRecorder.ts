import { createBucketUrl } from "@pusher/shared";
import { existsSync, writeFileSync } from "fs";
import { Page } from "puppeteer-core";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import fetch from "node-fetch";

const outputPath = "/tmp/output.mp4";

const ffmpegPath = "/tmp/ffmpeg";

const { BUCKET_NAME } = process.env;
if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME is not defined");
}

const downloadFFMPEG = async () => {
  if (existsSync(ffmpegPath)) {
    return;
  }

  const url = createBucketUrl(BUCKET_NAME, "ffmpeg");

  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) =>
      writeFileSync(ffmpegPath, Buffer.from(data), { mode: 755 })
    );
};

export type StopRecorderFunction = () => Promise<string | undefined>;

export const startRecorder = async (
  page: Page
): Promise<StopRecorderFunction | undefined> => {
  await downloadFFMPEG();

  // any is needed because of a mismatch between the types of puppeteer and puppeteer-core
  const recorder = new PuppeteerScreenRecorder(page as any, {
    ffmpeg_Path: ffmpegPath,
  });

  const hasStarted = await recorder
    .start(outputPath)
    .then(Boolean)
    .catch((error: Error) => {
      console.info("Error starting recorder", error.message);

      return false;
    });

  if (!hasStarted) {
    return undefined;
  }

  return async () => {
    await recorder.stop().catch((e) => {
      console.info("Error stopping recorder", e);

      return undefined;
    });

    return outputPath;
  };
};
