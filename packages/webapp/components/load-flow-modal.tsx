"use client";

import { DownloadCloudIcon, MoreHorizontalIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useFetchFlow } from "@/hooks/useFetchFlow";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type LoadFlowModalProps = {
  setOpen: (open: boolean) => void;
  open: boolean;
  defaultId: string;
};

export const LoadFlowModal: React.FC<LoadFlowModalProps> = ({
  defaultId,
  setOpen,
  open,
}) => {
  const { loading, fetchFlow } = useFetchFlow();

  const [id, setId] = useState("");

  const loadFlow = useCallback(
    async (flowId: string) => {
      const res = await fetchFlow(flowId);

      if (res?.type === "error") {
        toast.error(res.message ?? "Something went wrong");
      }

      if (!res || res.type === "success") {
        setOpen(false);
        setId("");
      }
    },
    [fetchFlow, setOpen]
  );

  const reloadFlow = useCallback(async () => {
    setId(defaultId);

    await loadFlow(defaultId);
  }, [defaultId, loadFlow]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load Flow</DialogTitle>

          <DialogDescription>Load a Flow from the database</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Flow Id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" disabled={loading} onClick={reloadFlow}>
            Reload current Flow
          </Button>

          <Button
            className="flex gap-2"
            variant="outline"
            disabled={!id || loading}
            onClick={() => id && loadFlow(id)}
          >
            {loading ? (
              <MoreHorizontalIcon size={18} />
            ) : (
              <DownloadCloudIcon size={18} />
            )}
            Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
