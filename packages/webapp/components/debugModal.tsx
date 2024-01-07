"use client";

import { Modal, Spin, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import { useWindowSize } from "@/hooks/useWindowSize";
import { serializedFlowSelector } from "@/state/flow";
import { LoadingOutlined } from "@ant-design/icons";
import { debugAction } from "@/app/api/debug.action";
import { useActionCall } from "@/hooks/useActionCall";

type DebugModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DebugModal: React.FC<DebugModalProps> = ({ setOpen, open }) => {
  const [video, setVideo] = useState<string | undefined>();

  const [loading, setLoadig] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const debug = useActionCall(debugAction);

  const getSerializedFlow = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(serializedFlowSelector)
  );

  const debugFlow = useCallback(async () => {
    setOpen(true);
    setLoadig(true);

    const serializedFlow = await getSerializedFlow();

    if (!serializedFlow) {
      setError("Your flow has no actions");
      setLoadig(false);
      return;
    }

    const response = await debug(serializedFlow);

    if (!response) {
      setOpen(false);
    }

    if (response?.type === "debug" && !video) {
      setVideo(response.videoUrl);
      setError(response.errorMessage);
    }

    if (response?.type === "debug" && video) {
      videoRef.current?.load();
      setError(response.errorMessage);
    }

    if (response?.type === "error") {
      setError(response?.message ?? "Something went wrong");
    }

    setLoadig(false);
  }, [debug, getSerializedFlow, setOpen, video]);

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
        <video style={{ width: "100%" }} ref={videoRef} src={video} controls />

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
