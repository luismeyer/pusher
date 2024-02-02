"use server";

import { NOT } from "duenamodb";

import { SubmitResponse } from "@pusher/shared";

import { auth } from "./auth";
import { flowsByUser, saveFlow } from "./db-flow";
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

  try {
    const decodedFlow = decodeURIComponent(flow);
    const flowPayload = JSON.parse(decodedFlow);

    if (user.plan === "hobby" && flowPayload.disabled === false) {
      const activeFlows = await flowsByUser(user.id, {
        filterOptions: { disabled: false, id: NOT(flowPayload.id) },
      });

      if (activeFlows.length >= 1) {
        return res.error("Hobby users can only have one active flow");
      }
    }

    validateFlow(flowPayload);

    await saveFlow({
      user: user.id,
      updatedAt: new Date().toISOString(),
      ...flowPayload,
    });

    return res.success();
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("Flow parsing error");
  }
};
