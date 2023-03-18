import { Page } from "puppeteer-core";

export const textContentMatches = async (
  page: Page,
  selector: string,
  text: string
) => {
  try {
    const element = await page.waitForSelector(selector);

    const elementText = await page.evaluate(
      (element) => element?.textContent,
      element
    );

    return elementText?.includes(text);
  } catch {
    return false;
  }
};
