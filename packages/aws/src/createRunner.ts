import { Stack } from "aws-cdk-lib";
import { resolve } from "path";

import { createFunction, FunctionOptions } from "./createFunction";
import { Environment } from "./readEnv";

export const RunnerFunction: FunctionOptions = {
  functionName: Environment.runnerFunctionName,
  folderPath: resolve(__dirname, "../../runner/dist"),
  fileName: "index.js",
  handlerFunctionName: "handler",
  timeoutMins: 15,
  memorySize: 5120,
  environment: {
    TELEGRAM_TOKEN: Environment.telegramToken,
    BUCKET_NAME: Environment.bucketName,
    TABLE_NAME: Environment.tableName,
    WEBSOCKET_APP_ID: Environment.webSocketAppId,
    NEXT_PUBLIC_WEBSOCKET_KEY: Environment.webSocketKey,
    WEBSOCKET_SECRET: Environment.webSocketSecret,
  },
};

export const createRunner = (stack: Stack) => {
  const runnerLambda = createFunction(stack, RunnerFunction);

  return runnerLambda;
};
