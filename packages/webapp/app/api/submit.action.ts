"use server";

import { Flow, SubmitResponse } from "@pusher/shared";

import { auth } from "./auth";
import { saveFlow } from "./flowDB";
import { res } from "./response";
import { validateFlow } from "./validateFlow";

export const submitAction = async (flow: string): Promise<SubmitResponse> => {
  const user = await auth();
  if (!user) {
    return res.unauth;
  }

  if (typeof flow !== "string") {
    return res.error("Wrong flow parameter");
  }

  let flowPayload: Flow;

  try {
    const decodedFlow = decodeURIComponent(flow);

    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("Flow parsing error");
  }

  await saveFlow({
    user: user.id,
    updatedAt: new Date().toISOString(),
    ...flowPayload,
  });

  return res.success();
};
