import { Flow } from "@pusher/shared";

import { handler } from "./";

const ExampleFlow: Flow = {
  id: "1d8713b0-16f1-4408-bc99-5e890c676b37",
  fails: 0,
  interval: "12h",
  name: "Example Flow",
  actionTree: {
    type: "openPage",
    pageUrl: "https://google.com",
    nextAction: {
      type: "click",
      selector: "#L2AGLb",
      nextAction: {
        type: "type",
        selector: "input",
        text: "Schafe",
        nextAction: {
          type: "click",
          selector: "#jZ2SBf",
          nextAction: {
            type: "telegram",
            chatId: "876296520",
            message: "SCHAFE",
          },
        },
      },
    },
  },
};

handler({ flow: ExampleFlow, debug: true });
