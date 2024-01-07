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
          if (res?.isValid) {
            return { valid: true, flow };
          }

          return { valid: false, error: res?.error };
        });
      } catch (error) {
        return { valid: false, error: "Invalid JSON" };
      }
    },
    [validate]
  );

  return validateFlow;
};
