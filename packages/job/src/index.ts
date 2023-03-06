import puppeteer from "puppeteer";
import { CheckOptions } from "./checkCenter";
import { Flow } from "./db";
import { executeFlow } from "./executeFlow";

// const centers: CheckOptions[] = [
//   {
//     page,
//     centerName: "Mitte",
//     accordionNumber: 2916,
//     serviceNumber: 8228,
//   },
//   {
//     page,
//     centerName: "Nord",
//     accordionNumber: 2928,
//     serviceNumber: 8274,
//   },
//   {
//     page,
//     centerName: "Stresemannstraße",
//     accordionNumber: 2941,
//     serviceNumber: 8322,
//   },
// ];

const ExampleFlow: Flow = {
  id: "1234567890",
  name: "Example",
  actions: {
    type: "openPage",
    pageUrl: "https://termin.bremen.de/termine/",
    nextAction: {
      type: "click",
      selector: '[name="BürgerServiceCenter-Mitte"]',
      nextAction: {
        type: "click",
        selector: "#header_concerns_accordion-3240",
        nextAction: {
          type: "click",
          selector: "#button-plus-8580",
          nextAction: {
            type: "scrollToBottom",
            nextAction: {
              type: "click",
              selector: "#WeiterButton",
              nextAction: {
                type: "textContentMatches",
                selector: "h1",
                textContent: "Keine Terminvorschläge verfügbar",
                trueNextAction: {
                  type: "telegram",
                  chatId: "876296520",
                  message: "Keine Termine verfügbar 😢",
                },
                falseNextAction: {
                  type: "telegram",
                  chatId: "876296520",
                  message: "Es sind Neue Termine verfügbar 🎉",
                },
              },
            },
          },
        },
      },
    },
  },
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await executeFlow(page, ExampleFlow);

  await browser.close();
};

main();
