import { Page } from "puppeteer";

export const waitFor = (page: Page, selector: string) =>
  page.waitForSelector(selector);
