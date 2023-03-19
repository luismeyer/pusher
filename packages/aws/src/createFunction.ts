import { Duration, Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { extname } from "path";

export type FunctionOptions = {
  functionName: string;
  folderPath: string;
  fileName: string;
  handlerFunctionName: string;
  timeoutMins: number;
  memorySize: number;
  environment: Record<string, string>;
};

export const createFunction = (stack: Stack, options: FunctionOptions) => {
  const {
    fileName,
    folderPath,
    handlerFunctionName,
    timeoutMins,
    memorySize,
    environment,
    functionName,
  } = options;

  const handler = fileName.replace(
    extname(fileName),
    `.${handlerFunctionName}`
  );

  new Function(stack, functionName, {
    runtime: Runtime.NODEJS_18_X,
    handler,
    code: Code.fromAsset(folderPath),
    timeout: Duration.minutes(timeoutMins),
    memorySize,
    environment,
  });
};
