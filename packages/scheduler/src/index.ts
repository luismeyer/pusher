import { isInterval } from "@pusher/shared";

import { callRunner } from "./callRunner";
import { flowsByInterval } from "./flowsByInterval";

const { INTERVAL } = process.env;

if (!INTERVAL) {
  throw new Error("Missing Env Var: INTERVAL");
}

if (!isInterval(INTERVAL)) {
  throw new Error(`Wrong INTERVAL: ${INTERVAL}`);
}

export const handler = async () => {
  const flows = await flowsByInterval(INTERVAL);

  const runnableFlows = flows.filter(
    ({ fails, disabled }) => !disabled && fails < 3
  );

  console.info(
    `Runnable flows for ${INTERVAL} interval: ${runnableFlows.length}`
  );

  await Promise.all(runnableFlows.map(callRunner));

  return true;
};
