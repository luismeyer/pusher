import { useCallback } from "react";
import { v4 } from "uuid";

import { Flow } from "@pusher/shared";

import { useActionCall } from "./useActionCall";
import { validateAction } from "@/app/api/validate.action";

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
  const validate = useActionCall(validateAction);

  const validateFlow = useCallback(
    async (flowString: string): Promise<ValidateFlowResult> => {
      try {
        const flow: Flow = {
          ...JSON.parse(flowString),
          id: v4(),
        };

        return validate(JSON.stringify(flow)).then((res) => {
          if (res?.type === "success") {
            return { valid: true, flow };
          }

          if (res?.type === "unauthorized") {
            return { valid: false, error: "Unauthorized" };
          }

          return { valid: false, error: res?.message };
        });
      } catch (error) {
        return { valid: false, error: "Invalid JSON" };
      }
    },
    [validate]
  );

  return validateFlow;
};
