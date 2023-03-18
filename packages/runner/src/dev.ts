import { Flow } from "@pusher/shared";

import { handler } from "./";

const ExampleFlow: Flow = {
  id: "9c655813-5997-4913-b68d-42e45ad8ee39",
  fails: 0,
  interval: "12h",
  name: "Example Flow",
  actionTree: {
    id: "83fd5979-0753-4780-8c3b-309a0911e8e9",
    type: "openPage",
    pageUrl: "https://google.com",
    nextAction: {
      id: "a3815b7c-fc3d-4a4c-9d43-78a4a99cca7e",
      type: "exists",
      selector: "blub",
      trueNextAction: {
        id: "683ef190-fb43-47ee-b9da-589b906834d2",
        type: "telegram",
        chatId: "876296520",
        message: "ES IST DA",
      },
      falseNextAction: {
        id: "928fbb7d-e6c5-4028-a666-80afd09b3913",
        type: "telegram",
        chatId: "876296520",
        message: "TEST",
      },
    },
  },
};

handler({ flow: ExampleFlow, debug: true }).then(console.log);
