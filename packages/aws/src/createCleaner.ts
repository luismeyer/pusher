import { Stack } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { resolve } from "path";

import { createFunction, FunctionOptions } from "./createFunction";
import { Environment } from "./readEnv";

export const CleanerFunction: FunctionOptions = {
  functionName: "pusher-cleaner",
  folderPath: resolve(__dirname, "../../cleaner/dist"),
  fileName: "index.js",
  handlerFunctionName: "handler",
  environment: {
    BUCKET_NAME: Environment.bucketName,
  },
};

export const createCleaner = (stack: Stack) => {
  const cleanerLambda = createFunction(stack, CleanerFunction);

  const cleanerEventRule = new Rule(stack, "PusherCleaner", {
    schedule: Schedule.cron({ minute: "0", hour: "0", day: "*" }),
  });

  cleanerEventRule.addTarget(new LambdaFunction(cleanerLambda));

  return cleanerLambda;
};
