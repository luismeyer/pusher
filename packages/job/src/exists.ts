import { Page } from "puppeteer";

export const exists = async (page: Page, selector: string) => {
  try {
    await page.$(selector);
    return true;
  } catch {
    return false;
  }
};
