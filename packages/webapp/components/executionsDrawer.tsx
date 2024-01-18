"use client";

import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";

import { ExecutionsInput } from "./executionInput";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { PlusCircle } from "lucide-react";

type ExecutionsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ExecutionsDrawer: React.FC<ExecutionsDrawerProps> = ({
  open,
  setOpen,
}) => {
  const [flow, setFlow] = useRecoilState(flowAtom);

  const addExecution = useCallback(() => {
    setFlow((pre) => ({
      ...pre,
      executions: [...(pre.executions ?? []), { name: "", variables: {} }],
    }));
  }, [setFlow]);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent className="h-4/5 flex flex-col">
        <div className="p-4 pb-8 grid gap-8 sm:w-1/2 self-center overflow-auto">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-2xl">
              Executions Configuration
            </DrawerTitle>
          </DrawerHeader>

          {flow.executions?.map((execution, index) => (
            <ExecutionsInput
              key={execution.name + index}
              execution={execution}
              index={index}
            />
          ))}

          <div className="flex justify-center">
            <Button className="flex gap-2 items-center" onClick={addExecution}>
              <PlusCircle size={18} />
              Add Execution
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
