import { SchedulerFunctions } from "../stack";
import { invokeCronLambda } from "./invokeCronLambda";

const main = async () => {
  for (const config of SchedulerFunctions) {
    await invokeCronLambda(config);
  }
};

main();
