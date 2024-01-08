import {
  Flow,
  runnerChannel,
  RunnerEvent,
  RunnerPayloadMap,
} from "@pusher/shared";
import Pusher from "pusher";

const { WEBSOCKET_APP_ID, NEXT_PUBLIC_WEBSOCKET_KEY, WEBSOCKET_SECRET } =
  process.env;

if (!WEBSOCKET_APP_ID || !NEXT_PUBLIC_WEBSOCKET_KEY || !WEBSOCKET_SECRET) {
  throw new Error("Missing websocket environment variables");
}

let singletonPusher: Pusher | undefined;
const pusherInstance = () => {
  if (singletonPusher) {
    return singletonPusher;
  }

  singletonPusher = new Pusher({
    appId: WEBSOCKET_APP_ID,
    key: NEXT_PUBLIC_WEBSOCKET_KEY,
    secret: WEBSOCKET_SECRET,
    cluster: "eu",
    useTLS: true,
  });

  return singletonPusher;
};

export const sendWebsocketEvent = async <TEvent extends RunnerEvent>(
  event: TEvent,
  payload: RunnerPayloadMap[TEvent],
  flow: Flow
) => {
  const pusher = pusherInstance();

  await pusher.trigger(runnerChannel(flow), event, payload);
};
