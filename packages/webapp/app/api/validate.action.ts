"use server";

import { ValidateResponse } from "@pusher/shared";
import { auth } from "./auth";

import { validateFlow } from "./validateFlow";

export const validateAction = async (
  flow: string
): Promise<ValidateResponse> => {
  auth();

  try {
    const decodedFlow = decodeURIComponent(flow);

    const flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);

    return { isValid: true };
  } catch (e) {
    if (e instanceof Error) {
      return { isValid: false, error: e.message };
    }

    return { isValid: false, error: "Invalid Flow" };
  }
};
