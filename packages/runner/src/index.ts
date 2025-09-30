import type { RunnerPayload, RunnerResult } from "@pusher/shared";

import { createBrowser } from "./createBrowser";
import { startRecorder, type StopRecorderFunction } from "./createRecorder";
import { executeFlow } from "./executeFlow";
import { increaseFails } from "./increaseFails";
import { sendWebsocketEvent } from "./sendWebsocketEvent";
import { uploadFileToS3 } from "./uploadFileToS3";

export const handler = async ({
  flow,
  debug,
}: RunnerPayload): Promise<RunnerResult> => {
  const browser = await createBrowser();
  const page = await browser.newPage();

  let stopRecorder: StopRecorderFunction | undefined;
  if (debug) {
    stopRecorder = await startRecorder(page);
  }

  let result: RunnerResult = { type: "error", message: "Unknown error" };

  await executeFlow(page, flow)
    .then(() => {
      result = { type: "success" };
    })
    .catch(async (error: Error) => {
      console.info(`Error in ${flow.id}:`, error);

      if (!debug) {
        await increaseFails(flow);
      }

      result = { type: "error", message: error.message };
    });

  console.info("Finished flow execution: ", result);

  // if debug mode and the recorder has been started successfully
  if (stopRecorder) {
    const videoPath = await stopRecorder();
    console.info("Stopped recording: ", videoPath);

    if (videoPath) {
      const videoUrl = await uploadFileToS3(videoPath, flow.id);
      console.info("Uploaded video to S3: ", videoUrl);

      if (videoUrl) {
        result = { type: "debug", videoUrl, errorMessage: result.message };
      }
    }
  }

  await browser.close();
  console.info("Closed browser");

  if (debug) {
    await sendWebsocketEvent("done", result, flow);
    console.info("Send websocket done event");
  }

  console.info("Returning result: ", result);

  return result;
};
