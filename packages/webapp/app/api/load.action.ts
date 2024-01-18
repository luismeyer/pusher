"use server";

import { AuthResponse, LoadResponse } from "@pusher/shared";
import { auth } from "./auth";

import { getFlow } from "./flowDB";
import { res } from "./response";

export const loadAction = async (
  id: string
): Promise<AuthResponse<LoadResponse>> => {
  const isAuthed = await auth();
  if (!isAuthed) {
    return res.unauth;
  }

  const flow = await getFlow(id);

  if (!flow) {
    return res.json({ type: "error", message: "Flow not found" });
  }

  return res.json({ type: "success", flow });
};
