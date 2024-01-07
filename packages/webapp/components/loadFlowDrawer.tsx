"use client";

import { Divider, Drawer, Space } from "antd";

import { useValidateFlowString } from "../hooks/useValidateFlow";

import { ImportExport } from "./importExport";
import { LoadFlow } from "./loadFlow";

type LoadFlowModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultId: string;
};

export const LoadFlowDrawer: React.FC<LoadFlowModalProps> = ({
  defaultId,
  open,
  setOpen,
}) => {
  const {} = useValidateFlowString();

  return (
    <Drawer
      placement="left"
      size="large"
      title="Load, Import or Export a Flow"
      open={open}
      onClose={() => setOpen(false)}
    >
      <Space direction="vertical" style={{ display: "flex" }}>
        <LoadFlow defaultId={defaultId} setOpen={setOpen} />

        <Divider />

        <ImportExport setOpen={setOpen} />
      </Space>
    </Drawer>
  );
};
