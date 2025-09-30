"use client";

import { useRecoilCallback, useRecoilValue } from "recoil";
import { v4 } from "uuid";

import {
  actionIdsAtom,
  useDeleteAction,
  useResetAction,
} from "@/state/actions";
import { flowAtom } from "@/state/flow";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ResetModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ResetModal: React.FC<ResetModalProps> = ({ setOpen, open }) => {
  const flow = useRecoilValue(flowAtom);

  const resetAction = useResetAction();

  const reset = useRecoilCallback(
    ({ snapshot, reset, set }) =>
      async () => {
        reset(flowAtom);

        const actionIds = await snapshot.getPromise(actionIdsAtom);
        set(actionIdsAtom, []);

        await Promise.all(actionIds.map(resetAction));

        set(flowAtom, (pre) => ({ ...pre, id: v4() }));

        setOpen(false);
      },
    [useDeleteAction, setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset</DialogTitle>

          <DialogDescription>
            Are you sure you want to reset this flow? All unsaved in this Flow
            changes will be lost.
          </DialogDescription>
        </DialogHeader>

        <span className="text-yellow-600 text-sm">
          Save you Flow id to edit it later: <br /> {flow.id}
        </span>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>

          <Button variant="destructive" type="button" onClick={reset}>
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
