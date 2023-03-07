import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { Page } from "puppeteer-core";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

const ffmpegPath = resolve(__dirname, "../bin/ffmpeg");

if (!existsSync(ffmpegPath)) {
  throw new Error("Missing ffmpeg installation");
}

const outputPath = "/tmp/output.mp4";

export const startRecorder = async (page: Page) => {
  // any is needed because of a mismatch between the types of puppeteer and puppeteer-core
  const recorder = new PuppeteerScreenRecorder(page as any, {
    ffmpeg_Path: ffmpegPath,
  });

  await recorder.start(outputPath);

  return async () => {
    await recorder.stop();

    return outputPath;
  };
};
