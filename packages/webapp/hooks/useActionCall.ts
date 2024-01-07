import { useRecoilState } from "recoil";

import { authOpenAtom } from "@/state/auth";

export const useActionCall = <A extends Array<unknown>, T>(
  action: (...args: A) => Promise<T>
) => {
  const [authOpen, setAuthOpen] = useRecoilState(authOpenAtom);

  return async (...args: A) => {
    try {
      const result = await action(...args);

      return result;
    } catch (e) {
      console.log("catch error");

      if (!authOpen) {
        setAuthOpen(true);
      }
    }
  };
};
