import { Page } from "puppeteer-core";

export const textContent = async (page: Page, selector: string) => {
  const element = await page.waitForSelector(selector, { timeout: 5000 });

  const elementText = await page.evaluate(
    (element) => element?.textContent,
    element,
  );

  return elementText ? elementText.trim() : undefined;
};
