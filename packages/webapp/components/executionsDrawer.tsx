"use client";

import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";

import { ExecutionsInput } from "./executionInput";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Executions Configuration</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 pb-8 grid gap-8">
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

  // return (
  //   <Drawer
  //     title="Executions Configuration"
  //     placement="left"
  //     size="large"
  //     onClose={() => setOpen(false)}
  //     open={open}
  //   >
  //     <List
  //       itemLayout="horizontal"
  //       dataSource={flow.executions}
  //       renderItem={(item, index) => (
  //         <List.Item>
  //           {<ExecutionsInput execution={item} index={index} />}
  //         </List.Item>
  //       )}
  //     />

  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         marginTop: 25,
  //       }}
  //     >
  //       <Button className="flex gap-2 items-center" onClick={addExecution}>
  //         <PlusCircleOutlined />
  //         Add Execution
  //       </Button>
  //     </div>
  //   </Drawer>
  // );
};
