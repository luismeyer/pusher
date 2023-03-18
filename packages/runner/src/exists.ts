import { Page } from "puppeteer-core";

export const exists = async (page: Page, selector: string) => {
  try {
    const result = await page.$(selector);

    return Boolean(result);
  } catch {
    return false;
  }
};
