"use client";

import { App, Modal, Space, Typography } from "antd";
import { useCallback } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

import { flowAtom, serializedFlowSelector } from "@/state/flow";
import { useActionCall } from "@/hooks/useActionCall";
import { submitAction } from "@/app/api/submit.action";

type SubmitModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SubmitModal: React.FC<SubmitModalProps> = ({ setOpen, open }) => {
  const { message } = App.useApp();

  const flowData = useRecoilValue(flowAtom);

  const getSerializedFlow = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        return await snapshot.getPromise(serializedFlowSelector);
      },
    []
  );

  const submit = useActionCall(submitAction);

  const submitFlow = useCallback(async () => {
    setOpen(false);

    const serializedFlow = await getSerializedFlow();

    if (!serializedFlow) {
      message.open({ type: "error", content: "Your flow has no actions" });
      return;
    }

    const response = await submit(serializedFlow);

    if (response?.type === "success") {
      message.open({ type: "success", content: "Uploaded you flow!" });
    }

    if (!response || response.type === "error") {
      message.open({
        type: "error",
        content: response?.message ?? "Something went wrong",
      });
    }
  }, [getSerializedFlow, message, setOpen, submit]);

  return (
    <Modal
      title="Submit your Flow"
      open={open}
      onCancel={() => setOpen(false)}
      cancelText="Cancel"
      onOk={submitFlow}
      okText="Submit"
    >
      <Space direction="vertical" size="middle">
        {!flowData.disabled && (
          <Typography.Text>
            Submit your Flow to see it in action. It will be stored in our cloud
            and executed in the defined interval.
          </Typography.Text>
        )}

        {flowData.disabled && (
          <Typography.Text type="danger">
            This Flow is disabled and will not run in the defined interval. You
            can submit anyways to store the Flow in our cloud.
          </Typography.Text>
        )}

        {flowData.fails >= 3 && (
          <Typography.Text type="danger">
            This Flow failed {flowData.fails} times and therefore will not be
            executed. Make sure to set the fails to a number below 3 to enable
            it again.
          </Typography.Text>
        )}

        <Typography.Text>
          Save you Flow id to edit it later:
          <p>
            <Typography.Text type="warning">{flowData.id}</Typography.Text>
          </p>
        </Typography.Text>
      </Space>
    </Modal>
  );
};
