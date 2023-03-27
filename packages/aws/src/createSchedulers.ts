import { Stack } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Function } from "aws-cdk-lib/aws-lambda";
import { resolve } from "path";

import { Flow } from "@pusher/shared";

import { createFunction, FunctionOptions } from "./createFunction";
import { Environment } from "./readEnv";

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

export const createSchedulers = (
  stack: Stack,
  table: Table,
  runner: Function
) => {
  SchedulerFunctions.forEach((functionOptions) => {
    const scheduleLambda = createFunction(stack, functionOptions);

    const { INTERVAL } = functionOptions.environment;

    const hour = INTERVAL.replace("h", "");

    const eventRule = new Rule(stack, `scheduleRule${INTERVAL}`, {
      schedule: Schedule.cron({ minute: "0", hour: `*/${hour}` }),
    });

    eventRule.addTarget(new LambdaFunction(scheduleLambda));

    table.grantReadData(scheduleLambda);
    runner.grantInvoke(scheduleLambda);
  });
};
