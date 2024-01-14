"use server";

import { AuthResponse } from "@pusher/shared";
import { auth } from "./auth";
import { res } from "./response";

export const tokenAction = async (): Promise<
  AuthResponse<{ isValid: true }>
> => {
  const isAuthed = await auth();
  if (!isAuthed) {
    return res.unauth;
  }

  return res.json({ isValid: true });
};
