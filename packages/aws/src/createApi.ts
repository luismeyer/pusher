import { CfnOutput, Stack } from "aws-cdk-lib";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { resolve } from "path";

import { createFunction, FunctionOptions } from "./createFunction";
import { Environment } from "./readEnv";

export const ApiFunction: FunctionOptions = {
  functionName: "pusher-api",
  folderPath: resolve(__dirname, "../../api/dist"),
  fileName: "index.js",
  handlerFunctionName: "handler",
  timeoutMins: 15,
  environment: {
    PUSHER_AUTH_TOKEN: Environment.pusherAuthToken,
    TABLE_NAME: Environment.tableName,
    RUNNER_FUNCTION_NAME: Environment.runnerFunctionName,
  },
};

export const createApi = (stack: Stack) => {
  const apiLambda = createFunction(stack, ApiFunction);
  const apiUrl = apiLambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
  });

  new CfnOutput(stack, "ApiUrl", { value: apiUrl.url });

  return apiLambda;
};
