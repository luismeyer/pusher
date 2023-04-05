import { Page } from "puppeteer-core";

export const waitFor = async (page: Page, selector: string) => {
  await page.waitForSelector(selector, { timeout: 5000 });
};
