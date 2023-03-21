import { Flow } from "@pusher/shared";
import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
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

export const ApiFunction: FunctionOptions = {
  functionName: "pusher-api",
  folderPath: resolve(__dirname, "../../api/dist"),
  fileName: "index.js",
  handlerFunctionName: "handler",
  timeoutMins: 15,
  environment: {
    TABLE_NAME: Environment.tableName,
    RUNNER_FUNCTION_NAME: Environment.runnerFunctionName,
  },
};

const Intervals: Flow["interval"][] = ["6h", "12h"];

export const SchedulerFunctions = Intervals.map(
  (interval): FunctionOptions => ({
    functionName: `pusher-scheduler-${interval}`,
    folderPath: resolve(__dirname, "../../scheduler/dist"),
    fileName: "index.js",
    handlerFunctionName: "handler",
    environment: {
      INTERVAL_INDEX_NAME: Environment.intervalIndexName,
      INTERVAL: interval,
      TABLE_NAME: Environment.tableName,
      RUNNER_FUNCTION_NAME: Environment.runnerFunctionName,
    },
  })
);

export const TableOptions = {
  partitionKeyName: "id",
  partitionKeyType: AttributeType.STRING,
  intervalIndexKeyName: "interval",
  intervalIndexKeyType: AttributeType.STRING,
};

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

    const {
      partitionKeyName,
      partitionKeyType,
      intervalIndexKeyName,
      intervalIndexKeyType,
    } = TableOptions;

    const table = new Table(this, tableName, {
      tableName,
      partitionKey: {
        name: partitionKeyName,
        type: partitionKeyType,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    table.addGlobalSecondaryIndex({
      indexName: intervalIndexName,
      projectionType: ProjectionType.ALL,
      partitionKey: {
        name: intervalIndexKeyName,
        type: intervalIndexKeyType,
      },
    });

    const runnerLambda = createFunction(this, RunnerFunction);

    const apiLambda = createFunction(this, ApiFunction);
    const apiUrl = apiLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "ApiUrl", { value: apiUrl.url });

    table.grantReadWriteData(apiLambda);
    runnerLambda.grantInvoke(apiLambda);

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
