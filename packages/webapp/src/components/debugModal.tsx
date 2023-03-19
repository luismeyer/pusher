import { Modal, Spin } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import { actionTreeSelector } from "@/state/actions";
import { FlowData } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Flow, RunnerResult } from "@pusher/shared";

import { useWindowSize } from "../hooks/useWindowSize";

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

  const debugFlow = useCallback(async () => {
    setOpen(true);
    setLoadig(true);

    const flow: Flow = {
      ...flowData,
      actionTree,
    };

    const body = encodeURIComponent(JSON.stringify(flow));

    const response: RunnerResult = await fetch(`/api/debug?flow=${body}`, {
      method: "POST",
    }).then((res) => res.json());

    if (response.type === "debug" && !video) {
      setVideo(response.videoUrl);
    }

    if (response.type === "debug" && video) {
      videoRef.current?.load();
    }

    if (response.type === "error") {
      console.error(response.message);
      setOpen(false);
    }

    setLoadig(false);
  }, [actionTree, flowData, setOpen, video]);

  // handle open updates
  useEffect(() => {
    if (open && !video && !loading) {
      debugFlow();
    }

    if (!open) {
      videoRef.current?.pause();
    }
  }, [debugFlow, loading, open, video]);

  const windowSize = useWindowSize();

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Modal
      className={styles.modal}
      title="Debug Flow"
      open={open}
      cancelButtonProps={{ disabled: loading }}
      onCancel={() => setOpen(false)}
      cancelText="Close"
      okButtonProps={{ disabled: loading }}
      onOk={debugFlow}
      okText="Debug"
      width={windowSize.width * 0.8}
    >
      <Spin
        spinning={!video}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      >
        <video ref={videoRef} className={styles.video} src={video} controls />
      </Spin>
    </Modal>
  );
};
