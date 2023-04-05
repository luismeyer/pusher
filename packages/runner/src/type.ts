import { Page } from "puppeteer-core";

export const type = async (page: Page, selector: string, text: string) => {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.type(selector, text);
};
