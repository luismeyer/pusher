"use server";

import { DebugResponse, Flow } from "@pusher/shared";

import { callRunner } from "./callRunner";
import { validateFlow } from "./validateFlow";
import { auth } from "./auth";

export const debugAction = async (flow: string): Promise<DebugResponse> => {
  auth();

  if (typeof flow !== "string") {
    return { type: "error", message: "Wrong flow parameter" };
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return { type: "error", message: e.message };
    }

    return { type: "error", message: "Flow parsing error" };
  }

  const result = await callRunner(flowPayload);

  if (result) {
    return result;
  }

  return { type: "error", message: "Could not parse payload" };
};
