import chromium from "@sparticuz/chromium-min";
import pup from "puppeteer";
import puppeteer from "puppeteer-core";

import { startRecorder } from "./createRecorder";
import { Flow } from "./db";
import { executeFlow } from "./executeFlow";
import { uploadFileToS3 } from "./uploadFileToS3";

const ExampleFlow: Flow = {
  id: "1234567890",
  name: "Example",
  fails: 0,
  executions: [
    {
      name: "Mitte",
      variables: {
        centerName: "Mitte",
        accordionNumber: "3240",
        serviceNumber: "8580",
      },
    },
    {
      name: "Nord",
      variables: {
        centerName: "Nord",
        accordionNumber: "2928",
        serviceNumber: "8274",
      },
    },
    {
      name: "Stresemannstraße",
      variables: {
        centerName: "Stresemannstraße",
        accordionNumber: "2941",
        serviceNumber: "8322",
      },
    },
  ],
  actionTree: {
    type: "openPage",
    pageUrl: "https://termin.bremen.de/termine/",
    nextAction: {
      type: "click",
      selector: '[name="BürgerServiceCenter-{{centerName}}"]',
      nextAction: {
        type: "click",
        selector: "#header_concerns_accordion-{{accordionNumber}}",
        nextAction: {
          type: "click",
          selector: "#button-plus-{{serviceNumber}}",
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

type Payload = {
  flow: Flow;
  debug: boolean;
};

export const handler = async ({
  flow,
  debug,
}: Payload): Promise<string | boolean> => {
  const executablePath = process.env.IS_LOCAL
    ? pup.executablePath()
    : await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar"
      );

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  const stopRecorder = debug && (await startRecorder(page));

  let result: string | boolean = true;

  await executeFlow(page, flow).catch((error) => {
    console.info(`Error in ${flow.id}:`, error);

    result = false;
  });

  if (stopRecorder) {
    const videoPath = await stopRecorder();

    result = await uploadFileToS3(videoPath);
  }

  await browser.close();

  return result;
};

// handler({ flow: ExampleFlow, debug: true }).then(console.log);
