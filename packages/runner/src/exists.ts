import { Page } from "puppeteer-core";

export const exists = async (page: Page, selector: string) => {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });

    const result = await page.$(selector);

    return Boolean(result);
  } catch {
    return false;
  }
};
