import { Page } from "puppeteer-core";

export const click = async (page: Page, selector: string) => {
  await page.waitForSelector(selector, { timeout: 5000 });
  await page.click(selector);
};
