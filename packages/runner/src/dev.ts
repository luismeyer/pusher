import { Flow } from "@pusher/shared";

import { handler } from "./";

const ExampleFlow: Flow = {
  id: "1d8713b0-16f1-4408-bc99-5e890c676b37",
  fails: 0,
  interval: "12h",
  name: "Example Flow",
  actionTree: {
    id: "123",
    type: "openPage",
    pageUrl: "https://google.com",
    nextAction: {
      id: "456",
      type: "click",
      selector: "#L2AGLb",
      nextAction: {
        id: "789",
        type: "type",
        selector: "input",
        text: "Schafe",
        nextAction: {
          id: "1011",
          type: "click",
          selector: "#jZ2SBf",
          nextAction: {
            id: "1213",
            type: "telegram",
            chatId: "876296520",
            message: "SCHAFE",
          },
        },
      },
    },
  },
};

handler({ flow: ExampleFlow, debug: true }).then(console.log);
