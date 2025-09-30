import { Duration, type Stack } from "aws-cdk-lib";
import {
  Code,
  Function as AwsFunction,
  Runtime,
  type LayerVersion,
} from "aws-cdk-lib/aws-lambda";
import { extname } from "node:path";

export type FunctionOptions = {
  functionName: string;
  folderPath: string;
  fileName: string;
  handlerFunctionName: string;
  timeoutMins?: number;
  memorySize?: number;
  environment: Record<string, string>;
  layers?: LayerVersion[];
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
    layers,
  } = options;

  const handler = fileName.replace(
    extname(fileName),
    `.${handlerFunctionName}`,
  );

  return new AwsFunction(stack, functionName, {
    runtime: Runtime.NODEJS_LATEST,
    functionName,
    handler,
    code: Code.fromAsset(folderPath),
    timeout: timeoutMins ? Duration.minutes(timeoutMins) : undefined,
    memorySize,
    environment,
    layers,
  });
};
