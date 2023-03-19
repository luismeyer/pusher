import { Flow } from "@pusher/shared";
import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
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

const Intervals: Flow["interval"][] = ["6h", "12h"];

const SchedulerFunctions = Intervals.map(
  (interval): FunctionOptions => ({
    functionName: `pusher-scheduler-${interval}`,
    folderPath: resolve(__dirname, "../../scheduler/dist"),
    fileName: "index.js",
    handlerFunctionName: "handler",
    environment: {
      INTERVAL_INDEX_NAME: Environment.intervalIndexName,
      INTERVAL: interval,
      TABLE_NAME: Environment.tableName,
    },
  })
);

export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { bucketName, tableName, intervalIndexName } = Environment;

    const bucket = new Bucket(this, bucketName, {
      bucketName,
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const table = new Table(this, tableName, {
      tableName,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    table.addGlobalSecondaryIndex({
      indexName: intervalIndexName,
      partitionKey: {
        name: "interval",
        type: AttributeType.STRING,
      },
    });

    const runnerLambda = createFunction(this, RunnerFunction);

    SchedulerFunctions.forEach((functionOptions) => {
      const scheduleLambda = createFunction(this, functionOptions);

      const { INTERVAL } = functionOptions.environment;

      const hour = INTERVAL.replace("h", "");

      const eventRule = new Rule(this, `scheduleRule${INTERVAL}`, {
        schedule: Schedule.cron({
          minute: "0",
          hour: `*/${hour}`,
        }),
      });

      eventRule.addTarget(new LambdaFunction(scheduleLambda));

      table.grantReadData(scheduleLambda);
      runnerLambda.grantInvoke(scheduleLambda);
    });

    bucket.grantPut(runnerLambda);

    table.grantReadWriteData(runnerLambda);
  }
}
