import { AuthResponse } from "@pusher/shared";

export const res = {
  unauth: { type: "unauthorized" } satisfies AuthResponse<unknown>,
  error: <T>(message: string): AuthResponse<T> => ({ type: "error", message }),
  success: <T>(data?: T): AuthResponse<T> => ({ type: "success", data }),
};
