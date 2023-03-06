import { Page } from "puppeteer";

export const openPage = async (page: Page, pageUrl: string) => {
  await page.goto(pageUrl);
  await page.waitForNetworkIdle();
};
