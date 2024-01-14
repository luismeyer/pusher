"use client";

import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import { isInterval } from "@pusher/shared";

import { DebugModal } from "./debugModal";
import { ExecutionsDrawer } from "./executionsDrawer";
import { LoadFlowDrawer } from "./loadFlowDrawer";
import { ResetModal } from "./resetModal";
import { SubmitModal } from "./submitModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);
  const [isExecutionsOpen, setIsExecutionsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between gap-5 items-center p-4">
        <div className="grid grid-cols-3 gap-2 w-1/2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              value={flowData.name}
              onChange={(e) =>
                setFlowData((pre) => ({ ...pre, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label className="text-black" htmlFor="fails">
              Fails
            </Label>
            <Input
              id="fails"
              value={flowData.fails}
              onChange={(e) =>
                setFlowData((pre) => ({
                  ...pre,
                  fails: Number(e.target.value ?? 0),
                }))
              }
            />
          </div>

          <div>
            <Label className="text-black" htmlFor="interval">
              Interval
            </Label>
            <ToggleGroup
              id="interval"
              className="w-full"
              type="single"
              variant="outline"
              value={flowData.interval}
              onValueChange={(value) => {
                if (isInterval(value)) {
                  setFlowData((pre) => ({ ...pre, interval: value }));
                }
              }}
            >
              {["6h", "12h"].map((interval) => (
                <ToggleGroupItem
                  className="w-full"
                  key={interval}
                  value={interval}
                  aria-label="Toggle bold"
                >
                  {interval}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsLoadFlowOpen(true)}
          >
            Load
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsExecutionsOpen(true)}
          >
            Executions
          </Button>

          <Button
            className="w-full"
            variant="destructive"
            onClick={() => setIsResetOpen(true)}
          >
            Reset
          </Button>
        </div>

        <div className="grid gap-2">
          <div className="flex gap-2 justify-center items-center">
            <Switch
              id="disabled"
              onCheckedChange={(update) =>
                setFlowData((pre) => ({ ...pre, disabled: !update }))
              }
            />
            <Label htmlFor="disabled">
              {flowData.disabled ? "disabled" : "enabled"}
            </Label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsDebugOpen(true)}
            >
              Test
            </Button>

            <Button
              className="w-full"
              variant="default"
              onClick={() => setIsSubmitOpen(true)}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      <LoadFlowDrawer
        defaultId={flowData.id}
        open={isLoadFlowOpen}
        setOpen={setIsLoadFlowOpen}
      />

      {/* <DebugModal open={isDebugOpen} setOpen={setIsDebugOpen} /> */}

      {/* <SubmitModal open={isSubmitOpen} setOpen={setIsSubmitOpen} /> */}

      <ExecutionsDrawer open={isExecutionsOpen} setOpen={setIsExecutionsOpen} />

      {/* <ResetModal open={isResetOpen} setOpen={setIsResetOpen} /> */}
    </>
  );
};
