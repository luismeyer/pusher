"use server";

import { AuthResponse, ValidateResponse } from "@pusher/shared";
import { auth } from "./auth";
import { res } from "./response";

import { validateFlow } from "./validateFlow";

export const validateAction = async (
  flow: string
): Promise<AuthResponse<ValidateResponse>> => {
  const isAuthed = await auth();
  if (!isAuthed) {
    return res.unauth;
  }

  try {
    const decodedFlow = decodeURIComponent(flow);

    const flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);

    return res.json({ type: "success" });
  } catch (e) {
    if (e instanceof Error) {
      return res.json({ type: "error", message: e.message });
    }

    return res.json({ type: "error", message: "Invalid Flow" });
  }
};
