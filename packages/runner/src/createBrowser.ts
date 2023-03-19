import pup from "puppeteer";
import puppeteer from "puppeteer-core";

import chromium from "@sparticuz/chromium-min";

export const createBrowser = async () => {
  const executablePath = process.env.IS_LOCAL
    ? pup.executablePath()
    : await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar"
      );

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    ignoreHTTPSErrors: true,
  });
};
