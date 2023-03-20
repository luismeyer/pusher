import { message, Modal, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";

import { flowAtom, flowParamsSelector } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { fetchApi } from "@/utils/fetchApi";
import { SubmitResponse } from "@pusher/shared";

type SubmitModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SubmitModal: React.FC<SubmitModalProps> = ({ setOpen, open }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const flowData = useRecoilValue(flowAtom);

  const flowParams = useRecoilValue(flowParamsSelector);

  const submitFlow = useCallback(async () => {
    setOpen(false);

    if (!flowParams) {
      messageApi.open({ type: "error", content: "Your flow has no actions" });
      return;
    }

    const response: SubmitResponse = await fetchApi("submit", flowParams);

    if (response.type === "success") {
      messageApi.open({ type: "success", content: "Uploaded you flow!" });
    }

    if (response.type === "error") {
      messageApi.open({ type: "error", content: response.message });
    }
  }, [flowParams, messageApi, setOpen]);

  const router = useRouter();

  const flowUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    return `${origin}${router.route}?${flowData.id}`;
  }, [flowData.id, router.route]);

  return (
    <>
      {contextHolder}

      <Modal
        title="Submit your Flow"
        open={open}
        onCancel={() => setOpen(false)}
        cancelText="Cancel"
        onOk={submitFlow}
        okText="Submit"
      >
        <div className={styles.submitContent}>
          {!flowData.disabled && (
            <Typography.Text>
              Submit your Flow to see it in action. It will be stored in our
              cloud and executed in the defined interval.
            </Typography.Text>
          )}

          {flowData.disabled && (
            <Typography.Text type="danger">
              This Flow is disabled and will not run in the defined interval.
              You can submit anyways to store the Flow in our cloud.
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
            Save this Link to edit your Flow later:{" "}
            <Link href={flowUrl} target="_blank">
              Link to your Flow
            </Link>
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
};
