"use client";

import { DownloadCloudIcon, MoreHorizontalIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useFetchFlow } from "@/hooks/useFetchFlow";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

type LoadFlowModalProps = {
  setOpen: (open: boolean) => void;
  defaultId: string;
};

export const LoadFlow: React.FC<LoadFlowModalProps> = ({
  defaultId,
  setOpen,
}) => {
  const { loading, fetchFlow } = useFetchFlow();

  const [id, setId] = useState<string | undefined>();

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
    <div className="flex flex-col gap-4">
      <h4 className="text-xl">Load Flow</h4>

      <div className="grid gap-2">
        <div className="flex gap-2">
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
        </div>

        <Input
          placeholder="Flow Id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
    </div>
  );
};
