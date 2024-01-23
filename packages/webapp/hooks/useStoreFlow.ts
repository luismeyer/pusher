import { useRecoilCallback } from "recoil";

import { Flow } from "@pusher/shared";
import { storeFlow } from "@/state/flow";

export const useStoreFlow = () => {
  return useRecoilCallback(({ set }) => (flow: Flow) => {
    storeFlow(flow, set);
  });
};
