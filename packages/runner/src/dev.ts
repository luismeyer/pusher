import { Flow } from "@pusher/shared";

import { handler } from "./";

const ExampleFlow: Flow = {
  id: "094e46fd-d01a-400a-9d60-80e891dda990",
  fails: 0,
  disabled: false,
  interval: "6h",
  name: "Google",
  executions: [
    { name: "Mitte", variables: { center: "Mitte" } },
    { name: "Nord", variables: { center: "Nord" } },
  ],
  actionTree: {
    id: "83fd5979-0753-4780-8c3b-309a0911e8e9",
    type: "openPage",
    pageUrl: "https://google.com",
    nextAction: {
      id: "b173281e-c6dd-4cf1-ad77-e53ef1a946bc",
      type: "click",
      selector: "#L2AGLb-{{ center }}",
      nextAction: {
        id: "3011d09d-cc9f-45cf-a8fe-b1319424f186",
        type: "type",
        selector: "input",
        text: "Schafe",
        nextAction: {
          id: "28965317-0973-4f1f-a28d-a6d6031369e0",
          type: "click",
          selector: "#jZ2SBf",
          nextAction: {
            id: "4b916497-daee-404d-8b75-19682874f147",
            type: "textContentMatches",
            selector: "h3",
            text: "Schafe - Wikipedia",
            trueNextAction: {
              id: "63029f60-7b5b-4d17-a01b-aadd4c9742f8",
              type: "telegram",
              chatId: "876296520",
              message: "Wikipedia gefunden",
            },
            falseNextAction: {
              id: "b764ee37-1fca-4fe8-8211-e70bb9eb57ee",
              type: "telegram",
              chatId: "876296520",
              message: "Wikipedia nicht gefunden",
            },
          },
        },
      },
    },
  },
};

handler({ flow: ExampleFlow, debug: true }).then(console.log);
