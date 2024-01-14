"use server";

import { AuthResponse, Flow, SubmitResponse } from "@pusher/shared";

import { auth } from "./auth";
import { saveFlow } from "./flowDB";
import { res } from "./response";
import { validateFlow } from "./validateFlow";

export const submitAction = async (
  flow: string
): Promise<AuthResponse<SubmitResponse>> => {
  const isAuthed = await auth();
  if (!isAuthed) {
    return res.unauth;
  }

  if (typeof flow !== "string") {
    return res.json({ type: "error", message: "Wrong flow parameter" });
  }

  let flowPayload: Flow;

  try {
    const decodedFlow = decodeURIComponent(flow);

    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return res.json({ type: "error", message: e.message });
    }

    return res.json({ type: "error", message: "Flow parsing error" });
  }

  await saveFlow(flowPayload);

  return res.json({ type: "success" });
};
