"use client";

import { useCallback } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { toast } from "sonner";

import { submitAction } from "@/app/api/submit.action";
import { useActionCall } from "@/hooks/useActionCall";
import { flowAtom, serializedFlowSelector } from "@/state/flow";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type SubmitModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SubmitModal: React.FC<SubmitModalProps> = ({ setOpen, open }) => {
  const flowData = useRecoilValue(flowAtom);

  const getSerializedFlow = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        return await snapshot.getPromise(serializedFlowSelector);
      },
    []
  );

  const submit = useActionCall(submitAction);

  const submitFlow = useCallback(async () => {
    setOpen(false);

    const serializedFlow = await getSerializedFlow();

    if (!serializedFlow) {
      toast.error("Your flow has no actions");
      return;
    }

    const response = await submit(serializedFlow);

    if (response?.type === "success") {
      toast.success("Uploaded you flow!");
    }

    if (!response || response.type === "error") {
      toast.error(response?.message ?? "Something went wrong");
    }
  }, [getSerializedFlow, setOpen, submit]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit your Flow</DialogTitle>

          <DialogDescription>
            Submit your Flow to see it in action. It will be stored in our cloud
            and executed in the defined interval.
          </DialogDescription>
        </DialogHeader>

        {flowData.disabled && (
          <p className="text-red-600 text-sm">
            This Flow is disabled and will not run in the defined interval. You
            can submit anyways to store the Flow in our cloud.
          </p>
        )}

        {flowData.fails >= 3 && (
          <p className="text-red-600 text-sm">
            This Flow failed {flowData.fails} times and therefore will not be
            executed. Make sure to set the fails to a number below 3 to enable
            it again.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>

          <Button type="button" onClick={submitFlow}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
