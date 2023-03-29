import { App, Button, Input, Space, Typography } from "antd";
import { useCallback, useState } from "react";

import { useFetchFlow } from "@/hooks/useFetchFlow";
import { CloudDownloadOutlined, LoadingOutlined } from "@ant-design/icons";

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
      <Typography.Title level={4}>Load Flow</Typography.Title>

      <Input
        placeholder="Flow Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <Space>
        <Button disabled={loading} onClick={() => setOpen(false)}>
          Cancel
        </Button>

        <Button disabled={loading} onClick={reloadFlow}>
          Reload current Flow
        </Button>

        <Button
          disabled={!id || loading}
          icon={loading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
          type="primary"
          onClick={() => id && loadFlow(id)}
        >
          Load
        </Button>
      </Space>
    </Space>
  );
};
