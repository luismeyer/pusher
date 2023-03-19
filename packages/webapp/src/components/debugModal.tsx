import { Modal, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import { useWindowSize } from "@/hooks/useWindowSize";
import { actionTreeSelector } from "@/state/actions";
import { FlowData } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Flow, RunnerResult } from "@pusher/shared";

type DebugModalProps = {
  flowData: FlowData;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DebugModal: React.FC<DebugModalProps> = ({
  flowData,
  setOpen,
  open,
}) => {
  const actionTree = useRecoilValue(actionTreeSelector);

  const [video, setVideo] = useState<string | undefined>();

  const [loading, setLoadig] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const debugFlow = useCallback(async () => {
    setOpen(true);
    setLoadig(true);

    const flow: Flow = {
      ...flowData,
      actionTree,
    };

    const body = encodeURIComponent(JSON.stringify(flow));

    const response: RunnerResult = await fetch(`/api/debug?flow=${body}`).then(
      (res) => res.json()
    );

    if (response.type === "debug" && !video) {
      setVideo(response.videoUrl);
      setError(undefined);
    }

    if (response.type === "debug" && video) {
      videoRef.current?.load();
      setError(undefined);
    }

    if (response.type === "error") {
      setError(response.message);
    }

    setLoadig(false);
  }, [actionTree, flowData, setOpen, video]);

  // handle open updates
  useEffect(() => {
    if (open && !video && !loading && !error) {
      debugFlow();
    }

    if (!open) {
      videoRef.current?.pause();
    }
  }, [debugFlow, error, loading, open, video]);

  const windowSize = useWindowSize();

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Modal
      title="Debug Flow"
      open={open}
      cancelButtonProps={{ disabled: loading }}
      onCancel={() => setOpen(false)}
      cancelText="Close"
      okButtonProps={{ disabled: loading }}
      onOk={debugFlow}
      okText="Debug"
      width={windowSize.width * 0.5}
      style={{ minWidth: 500 }}
    >
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      >
        <video ref={videoRef} className={styles.video} src={video} controls />

        {error && (
          <Typography.Text type="danger">
            <b>Error: </b>
            {error}
          </Typography.Text>
        )}
      </Spin>
    </Modal>
  );
};
