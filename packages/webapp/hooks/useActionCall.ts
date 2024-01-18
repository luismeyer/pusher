import { useSetRecoilState } from "recoil";

import { authOpenAtom } from "@/state/auth";
import { AuthResponse } from "@pusher/shared";

export const useActionCall = <
  Args extends Array<unknown>,
  Response extends object
>(
  action: (...args: Args) => Promise<AuthResponse<Response>>
) => {
  const setAuthOpen = useSetRecoilState(authOpenAtom);

  return async (...args: Args) => {
    const result = await action(...args);

    if (result.type === "unauthorized") {
      setAuthOpen(true);

      return;
    }

    return result.data;
  };
};
