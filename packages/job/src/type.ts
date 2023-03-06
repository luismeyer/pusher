import { Page } from "puppeteer";

export const type = async (page: Page, selector: string, text: string) => {
  await page.waitForSelector(selector);
  await page.type(selector, text);
};
