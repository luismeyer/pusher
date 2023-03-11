import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Flow } from "@pusher/shared";

const { RUNNER_FUNCTION_NAME } = process.env;

if (!RUNNER_FUNCTION_NAME) {
  throw new Error("Missing Env Var: RUNNER_FUNCTION_NAME");
}

const client = new LambdaClient({ region: "eu-central-1" });

export const callRunner = (flow: Flow) => {
  const command = new InvokeCommand({
    FunctionName: RUNNER_FUNCTION_NAME,
    InvocationType: "Event",
    Payload: Buffer.from(JSON.stringify(flow)),
  });

  return client.send(command);
};
