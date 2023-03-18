import { atom } from "recoil";
import { v4 } from "uuid";

import { Flow } from "@pusher/shared";

type FlowData = Omit<Flow, "actionTree">;

const defaultFlow: FlowData = {
  id: v4(),
  fails: 0,
  interval: "12h",
  name: "Example Flow",
};

export const flowAtom = atom<FlowData>({
  key: "Flow",
  default: defaultFlow,
});
