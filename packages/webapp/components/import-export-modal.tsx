"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";
import { toast } from "sonner";

import { useStoreFlow } from "@/hooks/useStoreFlow";
import { useValidateFlowString } from "@/hooks/useValidateFlow";
import { flowSelector } from "@/state/flow";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

type ImportExportModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  open,
  setOpen,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);

  const validateFlow = useValidateFlowString();

  const storeFlow = useStoreFlow();

  const getFlow = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return snapshot.getPromise(flowSelector);
      },
    []
  );

  const [importExport, setImportExport] = useState<string | undefined>("");

  const exportFlow = useCallback(async () => {
    const flow = await getFlow();

    if (!flow) {
      return;
    }

    const publicFlow = JSON.stringify(
      { ...flow, id: undefined, fails: 0 },
      null,
      4
    );

    setImportExport(publicFlow);
  }, [getFlow]);

  const importFlow = useCallback(async () => {
    if (!importExport) {
      return;
    }

    setLoading(true);

    const res = await validateFlow(importExport);

    if (res.valid) {
      storeFlow(res.flow);

      setOpen(false);
    }

    if (!res.valid && res.error) {
      toast.error(res.error);
    } else {
      setOpen(false);
    }

    setImportExport("");
    setLoading(false);
  }, [importExport, setOpen, storeFlow, validateFlow]);

  useEffect(() => {
    if (
      textAreaRef.current &&
      textAreaRef.current.scrollHeight < window.innerHeight * (3 / 4)
    ) {
      textAreaRef.current.style.height = "0";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [importExport]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setImportExport("");
        setOpen(value);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import and Export</DialogTitle>

          <DialogDescription>
            Import and Export your flow as JSON. Make sure to remove all secret
            values from the Flow
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Textarea
            className="resize-y"
            ref={textAreaRef}
            value={importExport}
            id="import-export-text"
            onChange={(e) => {
              setImportExport(e.target.value);
            }}
            placeholder="Paste exported flow here"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={!importExport || loading}
            onClick={importFlow}
          >
            Import
          </Button>

          <Button
            variant="outline"
            disabled={!!importExport || loading}
            onClick={exportFlow}
          >
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
