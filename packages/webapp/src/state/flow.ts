import { atom, selector } from "recoil";
import { v4 } from "uuid";

import { Flow } from "@pusher/shared";
import { localStorageEffect } from "./localStorage";
import { actionTreeSelector } from "./actions";

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

export const flowParamsSelector = selector({
  key: "FlowParam",
  get: ({ get }) => {
    const flowData = get(flowAtom);

    const actionTree = get(actionTreeSelector);

    if (!actionTree) {
      return undefined;
    }

    const flow: Flow = {
      ...flowData,
      actionTree,
    };

    const params = new URLSearchParams();
    params.set("flow", encodeURIComponent(JSON.stringify(flow)));

    return params;
  },
});
