import { SchedulerFunctions } from "../createSchedulers";
import { invokeCronLambda } from "./invokeCronLambda";

const main = async () => {
  for (const config of SchedulerFunctions) {
    await invokeCronLambda(config);
  }
};

main();
