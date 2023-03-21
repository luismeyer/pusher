import { CloudDownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Modal, Typography } from "antd";
import { useCallback, useState } from "react";
import { useLoadFlow } from "../hooks/useLoadFlow";

type LoadFlowModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const LoadFlowModal: React.FC<LoadFlowModalProps> = ({
  open,
  setOpen,
}) => {
  const { loading, loadFlow } = useLoadFlow();

  const [id, setId] = useState<string | undefined>();

  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    if (!id) {
      return;
    }

    const res = await loadFlow(id);

    if (!res || res.type === "error") {
      setError(res?.message ?? "Something went wrong");
      return;
    }

    if (res.type === "success") {
      setOpen(false);
    }
  }, [id, loadFlow, setOpen]);

  return (
    <Modal
      title="Load your Flow"
      open={open}
      onCancel={() => setOpen(false)}
      cancelText="Cancel"
      okButtonProps={{
        disabled: !id || loading,
        icon: loading ? <LoadingOutlined /> : <CloudDownloadOutlined />,
      }}
      onOk={load}
      okText="Submit"
    >
      <Typography.Text>
        Enter the flow id to load the flow into the editor.
      </Typography.Text>

      <Input placeholder="Flow Id" onChange={(e) => setId(e.target.value)} />

      <Typography.Text type="danger">{error}</Typography.Text>
    </Modal>
  );
};
