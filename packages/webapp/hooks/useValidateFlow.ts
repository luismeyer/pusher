import { useCallback } from "react";
import { v4 } from "uuid";

import { useFetchApi } from "./useFetchApi";
import { Flow, ValidateResponse } from "@pusher/shared";

type ValidateFlowResult =
  | {
      valid: true;
      flow: Flow;
    }
  | {
      valid: false;
      error?: string;
    };

export const useValidateFlowString = () => {
  const fetchApi = useFetchApi();

  const validateFlow = useCallback(
    async (flowString: string): Promise<ValidateFlowResult> => {
      try {
        const flow: Flow = {
          ...JSON.parse(flowString),
          id: v4(),
        };

        const params = new URLSearchParams();
        params.set("flow", encodeURIComponent(JSON.stringify(flow)));

        return fetchApi<ValidateResponse>("validate", params).then((res) => {
          if (res?.isValid) {
            return { valid: true, flow };
          }

          return { valid: false, error: res?.error };
        });
      } catch (error) {
        return { valid: false, error: "Invalid JSON" };
      }
    },
    [fetchApi]
  );

  return validateFlow;
};
