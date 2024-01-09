"use client";

import { Drawer, List } from "antd";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import { PlusCircleOutlined } from "@ant-design/icons";

import { ExecutionsInput } from "./executionInput";
import { Button } from "./ui/button";

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
    <Drawer
      title="Executions Configuration"
      placement="left"
      size="large"
      onClose={() => setOpen(false)}
      open={open}
    >
      <List
        itemLayout="horizontal"
        dataSource={flow.executions}
        renderItem={(item, index) => (
          <List.Item>
            {<ExecutionsInput execution={item} index={index} />}
          </List.Item>
        )}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 25,
        }}
      >
        <Button className="flex gap-2 items-center" onClick={addExecution}>
          <PlusCircleOutlined />
          Add Execution
        </Button>
      </div>
    </Drawer>
  );
};
