"use server";

import { LoadResponse } from "@pusher/shared";
import { auth } from "./auth";

import { getFlow } from "./flowDB";
import { res } from "./response";

export const loadAction = async (id: string): Promise<LoadResponse> => {
  const user = await auth();
  if (!user) {
    return res.unauth;
  }

  const flow = await getFlow(id);

  if (!flow) {
    return res.error("Flow not found");
  }

  return res.success(flow);
};
