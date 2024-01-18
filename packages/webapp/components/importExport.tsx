"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import { useStoreFlow } from "@/hooks/useStoreFlow";
import { useValidateFlowString } from "@/hooks/useValidateFlow";
import { flowSelector } from "@/state/flow";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type LoadFlowModalProps = {
  setOpen: (open: boolean) => void;
};

export const ImportExport: React.FC<LoadFlowModalProps> = ({ setOpen }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);

  const validateFlow = useValidateFlowString();

  const [warn, setWarn] = useState<string>();

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

    setWarn("Make sure to remove all secret values from the Flow");
  }, [getFlow]);

  const importFlow = useCallback(async () => {
    if (!importExport) {
      return;
    }

    setLoading(true);

    const res = await validateFlow(importExport);

    console.log({ res });
    if (res.valid) {
      await storeFlow(res.flow);

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
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [importExport]);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-xl">Import and Export</h4>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
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
        </div>

        {warn && <Label htmlFor="import-export-text">{warn}</Label>}

        <Textarea
          className="resize-y"
          ref={textAreaRef}
          value={importExport}
          id="import-export-text"
          onChange={(e) => {
            if (!e.target.value) {
              setWarn("");
            }

            setImportExport(e.target.value);
          }}
          placeholder="Paste exported flow here"
        />
      </div>
    </div>
  );
};
