"use server";

import { AuthResponse, ValidateResponse } from "@pusher/shared";
import { auth } from "./auth";
import { res } from "./response";

import { validateFlow } from "./validateFlow";

export const validateAction = async (
  flow: string
): Promise<AuthResponse<ValidateResponse>> => {
  const user = await auth();
  if (!user) {
    return res.unauth;
  }

  try {
    const decodedFlow = decodeURIComponent(flow);

    const flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);

    return res.success();
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("Invalid Flow");
  }
};
