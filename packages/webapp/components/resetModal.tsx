"use client";

import { Modal, Space, Typography } from "antd";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { v4 } from "uuid";

import {
  actionIdsAtom,
  useDeleteAction,
  useResetAction,
} from "@/state/actions";
import { flowAtom } from "@/state/flow";

type ResetModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ResetModal: React.FC<ResetModalProps> = ({ setOpen, open }) => {
  const flow = useRecoilValue(flowAtom);

  const resetAction = useResetAction();

  const reset = useRecoilCallback(
    ({ snapshot, reset, set }) =>
      async () => {
        reset(flowAtom);

        const actionIds = await snapshot.getPromise(actionIdsAtom);
        set(actionIdsAtom, []);

        await Promise.all(actionIds.map(resetAction));

        set(flowAtom, (pre) => ({ ...pre, id: v4() }));

        setOpen(false);
      },
    [useDeleteAction, setOpen]
  );

  return (
    <Modal
      title="Reset"
      open={open}
      onCancel={() => setOpen(false)}
      cancelText="Cancel"
      onOk={reset}
      okButtonProps={{ danger: true }}
      okText="Reset"
    >
      <Space direction="vertical">
        <Typography.Text>
          Are you sure you want to reset this flow? All unsaved in this Flow
          changes will be lost.
        </Typography.Text>

        <Typography.Text>
          Save you Flow id to edit it later:
          <p>
            <Typography.Text type="warning">{flow.id}</Typography.Text>
          </p>
        </Typography.Text>
      </Space>
    </Modal>
  );
};
