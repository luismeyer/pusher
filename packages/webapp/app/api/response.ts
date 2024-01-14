import { AuthResponse } from "@pusher/shared";

export const res = {
  unauth: { type: "unauthorized" } satisfies AuthResponse<unknown>,
  json: <T>(data: T): AuthResponse<T> => ({ type: "authorized", data }),
};
