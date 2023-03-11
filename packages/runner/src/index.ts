import { Flow } from "@pusher/shared";

import { createBrowser } from "./createBrowser";
import { startRecorder } from "./createRecorder";
import { executeFlow } from "./executeFlow";
import { increaseFails } from "./increaseFails";
import { uploadFileToS3 } from "./uploadFileToS3";

type Payload = {
  flow: Flow;
  debug: boolean;
};

export const handler = async ({
  flow,
  debug,
}: Payload): Promise<string | boolean> => {
  const browser = await createBrowser();
  const page = await browser.newPage();

  const stopRecorder = debug && (await startRecorder(page));

  let result: string | boolean = true;

  await executeFlow(page, flow).catch(async (error) => {
    console.info(`Error in ${flow.id}:`, error);

    await increaseFails(flow);

    result = false;
  });

  if (stopRecorder) {
    const videoPath = await stopRecorder();
    result = await uploadFileToS3(videoPath);
  }

  await browser.close();

  return result;
};
