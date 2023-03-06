import { Page } from "puppeteer";

export const textContentMatches = async (
  page: Page,
  selector: string,
  text: string
) => {
  const element = await page.waitForSelector(selector);
  const elementText = await page.evaluate(
    (element) => element?.textContent,
    element
  );

  return elementText?.includes(text);
};
