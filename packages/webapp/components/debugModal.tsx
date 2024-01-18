"use client";

import Pusher from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import { debugAction } from "@/app/api/debug.action";
import { useActionCall } from "@/hooks/useActionCall";
import { flowSelector, serializedFlowSelector } from "@/state/flow";
import {
  runnerChannel,
  RunnerDoneEvent,
  RunnerPayloadMap,
} from "@pusher/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

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
    setError(undefined);
    setLoadig(true);

    const serializedFlow = await getSerializedFlow();
    const flow = await getFlow();

    if (!serializedFlow || !flow) {
      setError("Your flow has no actions");
      setLoadig(false);
      return;
    }

    const res = await debug(serializedFlow);

    // unauthorized
    if (!res) {
      setOpen(false);
      setLoadig(false);
      return;
    }

    if (res?.type === "error") {
      setError(res?.message ?? "Something went wrong");
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
  }, [debug, getFlow, getSerializedFlow, setOpen, video]);

  // handle open updates
  useEffect(() => {
    if (open && !video && !loading && !error) {
      void debugFlow();
    }

    if (!open) {
      videoRef.current?.pause();
    }
  }, [debugFlow, error, loading, open, video]);

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Debug Flow</DialogTitle>

          <DialogDescription>
            Your flow runs in the cloud with a screen recorder. You can watch
            the video and see what went wrong.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[260px] w-full rounded-lg overflow-hidden">
          {loading || error ? (
            <div className="absolute w-full h-full grid place-content-center bg-gray-100 z-1 p-8">
              {error ? (
                <p>
                  <b>Error: </b>
                  {error}
                </p>
              ) : (
                "loading..."
              )}
            </div>
          ) : (
            <video
              className="border w-full h-full"
              ref={videoRef}
              src={video}
              controls={!loading}
            />
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            variant="outline"
          >
            Cancel
          </Button>

          <Button disabled={loading} type="button" onClick={debugFlow}>
            Debug
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
