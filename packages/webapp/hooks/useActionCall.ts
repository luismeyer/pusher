import { AuthResponse } from "@pusher/shared";
import { redirect } from "next/navigation";

export const useActionCall = <
  Args extends Array<unknown>,
  Data,
  Response extends AuthResponse<Data>,
>(
  action: (...args: Args) => Promise<Response>,
) => {
  return async (...args: Args) => {
    const result = await action(...args);

    if (result.type === "unauthorized") {
      redirect("/login");
    }

    return result;
  };
};
