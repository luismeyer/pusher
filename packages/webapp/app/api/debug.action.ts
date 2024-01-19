"use server";

import { DebugResponse, Flow } from "@pusher/shared";

import { callRunner } from "./callRunner";
import { validateFlow } from "./validateFlow";
import { auth } from "./auth";
import { res } from "./response";

export const debugAction = async (flow: string): Promise<DebugResponse> => {
  const user = await auth();
  if (!user) {
    return res.unauth;
  }

  if (typeof flow !== "string") {
    return res.error("Wrong flow parameter");
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("Flow parsing error");
  }

  try {
    await callRunner(flowPayload);

    return res.success();
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("Flow running error");
  }
};
