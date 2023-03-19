import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";

import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
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
  },
};

export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { bucketName } = Environment;

    new Bucket(this, bucketName, {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    createFunction(this, RunnerFunction);
  }
}
