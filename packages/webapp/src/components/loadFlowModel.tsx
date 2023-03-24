import { Button, Input, App, Modal, Space } from "antd";
import { useCallback, useState } from "react";

import { useLoadFlow } from "@/hooks/useLoadFlow";
import styles from "@/styles/topbar.module.css";
import {
  CloudDownloadOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

type LoadFlowModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultId: string;
};

export const LoadFlowModal: React.FC<LoadFlowModalProps> = ({
  defaultId,
  open,
  setOpen,
}) => {
  const { message } = App.useApp();

  const { loading, loadFlow } = useLoadFlow();

  const [id, setId] = useState<string | undefined>();

  const load = useCallback(
    async (flowId: string) => {
      const res = await loadFlow(flowId);

      if (res?.type === "error") {
        message.open({
          type: "error",
          content: res.message ?? "Something went wrong",
        });
      }

      if (!res || res.type === "success") {
        setOpen(false);
      }
    },
    [loadFlow, message, setOpen]
  );

  const reload = useCallback(async () => {
    setId(defaultId);

    await load(defaultId);
  }, [defaultId, load]);

  return (
    <Modal
      title="Load your Flow"
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <>
          <Button disabled={loading} onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={reload}>
            Reload current Flow
          </Button>

          <Button
            disabled={!id || loading}
            icon={loading ? <LoadingOutlined /> : <CloudDownloadOutlined />}
            type="primary"
            onClick={() => id && load(id)}
          >
            Load
          </Button>
        </>
      }
    >
      <Input
        placeholder="Flow Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
    </Modal>
  );
};
