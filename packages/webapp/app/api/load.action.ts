"use server";

import { LoadResponse } from "@pusher/shared";
import { auth } from "./auth";

import { getFlow } from "./flowDB";

export const loadAction = async (id: string): Promise<LoadResponse> => {
  auth();

  const flow = await getFlow(id);

  if (!flow) {
    return { type: "error", message: "Flow not found" };
  }

  return { type: "success", flow };
};
