import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Flow, RunnerPayload } from "@pusher/shared";

const { RUNNER_FUNCTION_NAME } = process.env;

if (!RUNNER_FUNCTION_NAME) {
  throw new Error("Missing Env Var: RUNNER_FUNCTION_NAME");
}

const client = new LambdaClient({
  region: process.env.REGION ?? "eu-central-1",
  endpoint: process.env.IS_LOCAL ? "http://localhost:3002" : undefined,
});

export const callRunner = (flow: Flow) => {
  const payload: RunnerPayload = {
    flow,
    debug: false,
  };

  const command = new InvokeCommand({
    FunctionName: RUNNER_FUNCTION_NAME,
    InvocationType: "Event",
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  return client.send(command);
};
