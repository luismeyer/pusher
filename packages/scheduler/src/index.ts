import { callRunner } from "./callRunner";
import { flowsByInterval } from "./flowsByInterval";
import { isInterval } from "./isInterval";

const { INTERVAL } = process.env;

if (!INTERVAL) {
  throw new Error("Missing Env Var: INTERVAL");
}

if (!isInterval(INTERVAL)) {
  throw new Error(`Wrong INTERVAL: ${INTERVAL}`);
}

export const handler = async () => {
  const flows = await flowsByInterval(INTERVAL);

  const runnableFlows = flows.filter(({ fails }) => fails < 3);

  await Promise.all(runnableFlows.map(callRunner));
};
