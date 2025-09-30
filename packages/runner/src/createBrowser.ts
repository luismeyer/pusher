import pup from "puppeteer";
import puppeteer from "puppeteer-core";

import chromium from "@sparticuz/chromium";

export const createBrowser = async () => {
  const executablePath = process.env.IS_LOCAL
    ? pup.executablePath()
    : await chromium.executablePath();

  const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
  };

  return puppeteer.launch({
    args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
    defaultViewport: viewport,
    executablePath,
    headless: "shell",
  });
};
