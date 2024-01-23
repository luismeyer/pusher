import { CallbackInterface, atom, selector } from "recoil";
import { v4 } from "uuid";

import {
  Action,
  Execution,
  Flow,
  isDecisionAction,
  isNavigationAction,
} from "@pusher/shared";

import { actionIdsAtom, actionTreeSelector } from "./actions";
import { dataAtom } from "./data";
import { positionAtom } from "./position";
import { relationAtom } from "./relation";

export type FlowData = Omit<Flow, "actionTree">;

export const flowAtom = atom<FlowData>({
  key: "Flow",
  effects: [],
  default: {
    id: "",
    fails: 0,
    disabled: false,
    interval: "12h",
    name: "Example Flow",
  },
});

export const flowSelector = selector<Flow | undefined>({
  key: "FlowSelector",
  get: ({ get }) => {
    const flowData = get(flowAtom);

    const actionTree = get(actionTreeSelector);

    if (!actionTree) {
      return undefined;
    }

    return {
      ...flowData,
      actionTree,
    };
  },
});

export const serializedFlowSelector = selector({
  key: "FlowParam",
  get: ({ get }) => {
    const flow = get(flowSelector);

    if (!flow) {
      return undefined;
    }

    return encodeURIComponent(JSON.stringify(flow));
  },
});

export const executionsSelector = selector({
  key: "Executions",
  get: ({ get }) => {
    const flowData = get(flowAtom);

    return flowData.executions ?? [];
  },
  set: ({ set }, executions) => {
    set(flowAtom, (flowData) => ({
      ...flowData,
      executions: executions as Execution[],
    }));
  },
});

export const defaultVariables = selector({
  key: "DefaultVariables",
  get: ({ get }) => {
    const executions = get(executionsSelector);

    if (!executions?.length) {
      return [];
    }

    return Object.keys(executions[0].variables ?? {}) ?? [];
  },
});

export const storeFlow = (flow: Flow, set: CallbackInterface["set"]) => {
  const storeAction = (action: Action, set: CallbackInterface["set"]) => {
    let actionData = action;

    if (isDecisionAction(action)) {
      const { falseNextAction, trueNextAction, ...rest } = action;
      actionData = rest;

      if (falseNextAction) {
        set(relationAtom(action.id), (pre) => ({
          ...pre,
          falseNextAction: falseNextAction?.id,
        }));

        storeAction(falseNextAction, set);
      }

      if (trueNextAction) {
        set(relationAtom(action.id), (pre) => ({
          ...pre,
          trueNextAction: trueNextAction?.id,
        }));

        storeAction(trueNextAction, set);
      }
    }

    if (isNavigationAction(action)) {
      const { nextAction, ...rest } = action;
      actionData = rest;

      if (nextAction) {
        set(relationAtom(action.id), { nextAction: nextAction?.id });

        storeAction(nextAction, set);
      }
    }

    set(positionAtom(action.id), {
      x: actionData.x ?? 0,
      y: actionData.y ?? 0,
    });

    set(dataAtom(action.id), actionData);

    set(actionIdsAtom, (pre) => [...pre, action.id]);
  };

  set(flowAtom, flow);

  storeAction(flow.actionTree, set);
};
