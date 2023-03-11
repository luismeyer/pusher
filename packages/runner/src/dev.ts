import { Flow } from "@pusher/shared";
import { handler } from ".";

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

handler({ flow: ExampleFlow, debug: true });
