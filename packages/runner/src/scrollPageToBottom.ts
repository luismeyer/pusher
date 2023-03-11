import { Page } from "puppeteer-core";

export const scrollPageToBottom = async (page: Page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;

        const timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      })
  );
