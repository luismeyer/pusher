import { Page } from "puppeteer-core";

import { textContent } from "./textContent";

export const textContentMatches = async (
  page: Page,
  selector: string,
  text: string
) => {
  try {
    const elementText = await textContent(page, selector);

    return Boolean(elementText?.includes(text));
  } catch {
    return false;
  }
};
