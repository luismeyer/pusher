import { RunnerPayload, RunnerResult } from "@pusher/shared";

import { createBrowser } from "./createBrowser";
import { startRecorder, StopRecorderFunction } from "./createRecorder";
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
      console.info(`Error in ${flow.id}:`, error.message);

      if (!debug) {
        await increaseFails(flow);
      }

      result = { type: "error", message: error.message };
    });

  // if debug mode and the recorder has been started successfully
  if (stopRecorder) {
    const videoPath = await stopRecorder();

    if (videoPath) {
      const videoUrl = await uploadFileToS3(videoPath, flow.id);

      if (videoUrl) {
        result = { type: "debug", videoUrl, errorMessage: result.message };
      }
    }
  }

  await browser.close();

  if (debug) {
    await sendWebsocketEvent("done", result, flow);
  }

  return result;
};
