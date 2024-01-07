"use server";

import { Flow, SubmitResponse } from "@pusher/shared";

import { auth } from "./auth";
import { saveFlow } from "./flowDB";
import { validateFlow } from "./validateFlow";

export const submitAction = async (flow: string): Promise<SubmitResponse> => {
  auth();

  if (typeof flow !== "string") {
    return { type: "error", message: "Wrong flow parameter" };
  }

  let flowPayload: Flow;

  try {
    const decodedFlow = decodeURIComponent(flow);

    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return { type: "error", message: e.message };
    }

    return { type: "error", message: "Flow parsing error" };
  }

  await saveFlow(flowPayload);

  return { type: "success" };
};
