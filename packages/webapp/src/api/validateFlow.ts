import { DeepPartial } from "@/utils/deepPartial";
import { Action, Flow } from "@pusher/shared";

const isValidUrl = (string: string) => {
  try {
    new URL(string);

    return true;
  } catch (err) {
    return false;
  }
};

const validateAction = (action: DeepPartial<Action>): action is Action => {
  Object.entries(action).forEach(([key, value]) => {
    if ("pageUrl" in action && !isValidUrl(action.pageUrl ?? "")) {
      throw new Error(`Invalid pageUrl in action: ${action.id}`);
    }

    if (typeof value === "string" && !value.length) {
      throw new Error(`Missing ${key} in action: ${action.id}`);
    }

    if (typeof value === "number" && !value) {
      throw new Error(`Missing ${key} in action: ${action.id}`);
    }

    if (typeof value === "object") {
      validateAction(value);
    }
  });

  return true;
};

export const validateFlow = (flow: DeepPartial<Flow>): flow is Flow => {
  if (typeof flow !== "object") {
    throw new Error("Wrong flow structure");
  }

  if (!flow.id?.length) {
    throw new Error("Missing flow id");
  }

  if (!flow.name?.length) {
    throw new Error("Missing flow name");
  }

  if (flow.interval !== "12h" && flow.interval !== "6h") {
    throw new Error("Wrong interval");
  }

  if (!flow.actionTree) {
    throw new Error("Flow has no actions");
  }

  if (flow.actionTree.type !== "openPage") {
    throw new Error("Start action has to be openPage");
  }

  if (!flow.actionTree.nextAction || !flow.actionTree.nextAction) {
    throw new Error("Flow has only one action");
  }

  validateAction(flow.actionTree);

  return true;
};
