import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Flow, RunnerPayload, RunnerResult } from "@pusher/shared";

const { RUNNER_FUNCTION_NAME } = process.env;

if (!RUNNER_FUNCTION_NAME) {
  throw new Error("Missing Env Var: RUNNER_FUNCTION_NAME");
}

const client = new LambdaClient({
  region: process.env.REGION ?? "eu-central-1",
  endpoint: process.env.IS_LOCAL ? "http://localhost:3002" : undefined,
  credentials: process.env.IS_LOCAL
    ? { accessKeyId: "LOCAL", secretAccessKey: "LOCAL" }
    : undefined,
});

export const callRunner = async (flow: Flow) => {
  const payload: RunnerPayload = {
    flow,
    debug: true,
  };

  const command = new InvokeCommand({
    FunctionName: RUNNER_FUNCTION_NAME,
    InvocationType: "Event",
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  const result = await client.send(command);

  if (result.Payload) {
    const response = Buffer.from(result.Payload).toString("utf8");

    return JSON.parse(response) as RunnerResult;
  }
};
