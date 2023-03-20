import { Modal, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import { useWindowSize } from "@/hooks/useWindowSize";
import { flowParamsSelector } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { fetchApi } from "@/utils/fetchApi";
import { LoadingOutlined } from "@ant-design/icons";
import { RunnerResult } from "@pusher/shared";

type DebugModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DebugModal: React.FC<DebugModalProps> = ({ setOpen, open }) => {
  const [video, setVideo] = useState<string | undefined>();

  const [loading, setLoadig] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const flowParams = useRecoilValue(flowParamsSelector);

  const debugFlow = useCallback(async () => {
    setOpen(true);
    setLoadig(true);

    if (!flowParams) {
      setError("Your flow has no actions");
      setLoadig(false);
      return;
    }

    const response: RunnerResult = await fetchApi("debug", flowParams);

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
  }, [flowParams, setOpen, video]);

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
