import type { Stack } from "aws-cdk-lib";
import { Code, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { resolve } from "path";
import { chromiumLayerPath } from "./aws";

import { createFunction, type FunctionOptions } from "./createFunction";
import { Environment } from "./readEnv";

export const RunnerFunction: FunctionOptions = {
  functionName: Environment.runnerFunctionName,
  folderPath: resolve(__dirname, "../../runner/dist"),
  fileName: "index.js",
  handlerFunctionName: "handler",
  timeoutMins: 15,
  memorySize: 5120,
  environment: {
    RESEND_TOKEN: Environment.resendToken,
    TELEGRAM_TOKEN: Environment.telegramToken,
    BUCKET_NAME: Environment.bucketName,
    TABLE_NAME: Environment.tableName,
    WEBSOCKET_APP_ID: Environment.webSocketAppId,
    NEXT_PUBLIC_WEBSOCKET_KEY: Environment.webSocketKey,
    WEBSOCKET_SECRET: Environment.webSocketSecret,
  },
};

export const createRunner = (stack: Stack) => {
  const chromiumLayer = new LayerVersion(stack, "ChromiumLayer", {
    code: Code.fromAsset(chromiumLayerPath),
    compatibleRuntimes: [Runtime.NODEJS_18_X],
    description: "A layer to use chromium in lambda functions",
  });

  const runnerLambda = createFunction(stack, {
    ...RunnerFunction,
    layers: [chromiumLayer],
  });

  return runnerLambda;
};
