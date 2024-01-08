"use client";

import { Modal, Spin, Typography } from "antd";
import Pusher from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import { debugAction } from "@/app/api/debug.action";
import { useActionCall } from "@/hooks/useActionCall";
import { useWindowSize } from "@/hooks/useWindowSize";
import { flowSelector, serializedFlowSelector } from "@/state/flow";
import { LoadingOutlined } from "@ant-design/icons";
import {
  runnerChannel,
  RunnerDoneEvent,
  RunnerPayloadMap,
} from "@pusher/shared";

type DebugModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

if (!process.env.NEXT_PUBLIC_WEBSOCKET_KEY) {
  throw new Error("NEXT_PUBLIC_WEBSOCKET_KEY is not defined");
}

const pusher = new Pusher(process.env.NEXT_PUBLIC_WEBSOCKET_KEY, {
  cluster: "eu",
});

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
  const getFlow = useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(flowSelector)
  );

  const debugFlow = useCallback(async () => {
    setOpen(true);
    setLoadig(true);

    const serializedFlow = await getSerializedFlow();
    const flow = await getFlow();

    if (!serializedFlow || !flow) {
      setError("Your flow has no actions");
      setLoadig(false);
      return;
    }

    const channelName = runnerChannel(flow);
    const channel = pusher.subscribe(channelName);

    channel.bind(
      RunnerDoneEvent,
      (response: RunnerPayloadMap[typeof RunnerDoneEvent]) => {
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

        channel.unbind(RunnerDoneEvent);
        pusher.unsubscribe(channelName);
      }
    );

    await debug(serializedFlow);
  }, [debug, getFlow, getSerializedFlow, setOpen, video]);

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
