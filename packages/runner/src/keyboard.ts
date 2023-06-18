import { Page } from "puppeteer-core";

import { Key } from "@pusher/shared";

export const keyboard = async (page: Page, key: Key) => {
  await page.keyboard.press(key);
};
