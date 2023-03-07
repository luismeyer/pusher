import { Page } from "puppeteer-core";

export const waitFor = (page: Page, selector: string) =>
  page.waitForSelector(selector);
