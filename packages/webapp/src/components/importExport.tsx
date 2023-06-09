import { App, Button, Input, Space, Typography } from "antd";
import { useCallback, useState } from "react";
import { useRecoilCallback } from "recoil";

import { useStoreFlow } from "@/hooks/useStoreFlow";
import { useValidateFlowString } from "@/hooks/useValidateFlow";
import { flowSelector } from "@/state/flow";

const { TextArea } = Input;

type LoadFlowModalProps = {
  setOpen: (open: boolean) => void;
};

export const ImportExport: React.FC<LoadFlowModalProps> = ({ setOpen }) => {
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const validateFlow = useValidateFlowString();

  const [warn, setWarn] = useState<string>();

  const storeFlow = useStoreFlow();

  const getFlow = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return snapshot.getPromise(flowSelector);
      },
    []
  );

  const [importExport, setImportExport] = useState<string | undefined>("");

  const exportFlow = useCallback(async () => {
    const flow = await getFlow();

    if (!flow) {
      return;
    }

    const publicFlow = JSON.stringify(
      { ...flow, id: undefined, fails: 0 },
      null,
      4
    );

    setImportExport(publicFlow);

    setWarn("Make sure to remove all secret values from the Flow");
  }, [getFlow]);

  const importFlow = useCallback(async () => {
    if (!importExport) {
      return;
    }

    setLoading(true);

    const res = await validateFlow(importExport);

    if (res.valid) {
      await storeFlow(res.flow);

      setOpen(false);
    }

    if (!res.valid && res.error) {
      message.error(res.error);
    } else {
      setOpen(false);
    }

    setImportExport("");
    setLoading(false);
  }, [importExport, message, setOpen, storeFlow, validateFlow]);

  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Typography.Title level={4}>Import and Export</Typography.Title>

      <Typography.Text type="warning">{warn}</Typography.Text>

      <TextArea
        allowClear
        autoSize
        value={importExport}
        onChange={(e) => {
          if (!e.target.value) {
            setWarn("");
          }

          setImportExport(e.target.value);
        }}
        placeholder="Paste exported flow here"
      />

      <Space>
        <Button
          type="primary"
          disabled={!importExport || loading}
          onClick={importFlow}
        >
          Import
        </Button>

        <Button
          type="primary"
          disabled={!!importExport || loading}
          onClick={exportFlow}
        >
          Export
        </Button>
      </Space>
    </Space>
  );
};
