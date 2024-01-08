import pup from "puppeteer";
import puppeteer from "puppeteer-core";

import chromium from "@sparticuz/chromium";

export const createBrowser = async () => {
  const executablePath = process.env.IS_LOCAL
    ? pup.executablePath()
    : await chromium.executablePath();

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
};
