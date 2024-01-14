"use server";

import { AuthResponse, DebugResponse, Flow } from "@pusher/shared";

import { callRunner } from "./callRunner";
import { validateFlow } from "./validateFlow";
import { auth } from "./auth";
import { res } from "./response";

export const debugAction = async (
  flow: string
): Promise<AuthResponse<DebugResponse>> => {
  const isAuthed = await auth();
  if (!isAuthed) {
    return res.unauth;
  }

  if (typeof flow !== "string") {
    return res.json({ type: "error", message: "Wrong flow parameter" });
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return res.json({ type: "error", message: e.message });
    }

    return res.json({ type: "error", message: "Flow parsing error" });
  }

  try {
    await callRunner(flowPayload);

    return res.json({ type: "success" });
  } catch (e) {
    if (e instanceof Error) {
      return res.json({ type: "error", message: e.message });
    }

    return res.json({ type: "error", message: "Flow running error" });
  }
};
