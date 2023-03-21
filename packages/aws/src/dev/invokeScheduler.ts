import { join } from "path";
import { Lambda, LambdaMode } from "runl";

import { SchedulerFunctions } from "../stack";

const main = async () => {
  for (const config of SchedulerFunctions) {
    const {
      fileName,
      folderPath,
      handlerFunctionName,
      timeoutMins,
      environment,
    } = config;

    const lambdaPath = join(folderPath, fileName);

    const lambda = new Lambda({
      mode: LambdaMode.Ephemeral,
      lambdaPath,
      lambdaHandler: handlerFunctionName,
      lambdaTimeout: timeoutMins ? timeoutMins * 60 * 1000 : undefined,
      autoReload: true,
      environment: {
        IS_LOCAL: "true",
        ...environment,
      },
    });

    console.info("Invoking:", lambdaPath);

    const result = await lambda.execute();

    console.info("Result:", result);
  }
};

main();
