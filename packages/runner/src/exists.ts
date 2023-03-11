import { Page } from "puppeteer-core";

export const exists = async (page: Page, selector: string) => {
  try {
    await page.$(selector);
    return true;
  } catch {
    return false;
  }
};
