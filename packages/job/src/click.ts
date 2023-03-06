import { Page } from "puppeteer";

export const click = async (page: Page, selector: string) => {
  await page.waitForSelector(selector);
  await page.click(selector);

  await page.waitForNetworkIdle();
};
