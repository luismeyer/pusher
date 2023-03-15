import { atom } from "recoil";
import { v4 } from "uuid";

import { Flow } from "@pusher/shared";

const defaultFlow: Flow = {
  id: v4(),
  fails: 0,
  interval: "12h",
  name: "Example Flow",
  actionTree: {
    pageUrl: "https://www.google.de",
    type: "openPage",
  },
};

export const flowAtom = atom<Flow>({
  key: "Flow",
  default: defaultFlow,
});
