"use client";

import { App, Input, Space } from "antd";
import Title from "antd/lib/typography/Title";
import { useCallback, useState } from "react";

import { useFetchFlow } from "@/hooks/useFetchFlow";
import { CloudDownloadOutlined, LoadingOutlined } from "@ant-design/icons";

import { Button } from "./ui/button";

type LoadFlowModalProps = {
  setOpen: (open: boolean) => void;
  defaultId: string;
};

export const LoadFlow: React.FC<LoadFlowModalProps> = ({
  defaultId,
  setOpen,
}) => {
  const { message } = App.useApp();

  const { loading, fetchFlow } = useFetchFlow();

  const [id, setId] = useState<string | undefined>();

  const loadFlow = useCallback(
    async (flowId: string) => {
      const res = await fetchFlow(flowId);

      if (res?.type === "error") {
        message.open({
          type: "error",
          content: res.message ?? "Something went wrong",
        });
      }

      if (!res || res.type === "success") {
        setOpen(false);
        setId("");
      }
    },
    [fetchFlow, message, setOpen]
  );

  const reloadFlow = useCallback(async () => {
    setId(defaultId);

    await loadFlow(defaultId);
  }, [defaultId, loadFlow]);

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Title level={4}>Load Flow</Title>

      <Input
        placeholder="Flow Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <Space>
        <Button variant="secondary" disabled={loading} onClick={reloadFlow}>
          Reload current Flow
        </Button>

        <Button
          className="flex gap-2"
          disabled={!id || loading}
          onClick={() => id && loadFlow(id)}
        >
          {loading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
          Load
        </Button>
      </Space>
    </Space>
  );
};
