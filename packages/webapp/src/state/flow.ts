import { atom } from "recoil";
import { v4 } from "uuid";

import { Flow } from "@pusher/shared";
import { localStorageEffect } from "./localStorage";

export type FlowData = Omit<Flow, "actionTree">;

const defaultFlow: FlowData = {
  id: v4(),
  fails: 0,
  disabled: false,
  interval: "12h",
  name: "Example Flow",
};

export const flowAtom = atom<FlowData>({
  key: "Flow",
  effects: [localStorageEffect],
  default: defaultFlow,
});
