import { useRecoilCallback } from "recoil";

import { connectStartAtom } from "@/state/connect";

export const useCancelConnect = () => {
  const cancelConnect = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const connectStart = await snapshot.getPromise(connectStartAtom);

        if (!connectStart) {
          return;
        }

        set(connectStartAtom, undefined);
      },
    [],
  );

  return cancelConnect;
};
