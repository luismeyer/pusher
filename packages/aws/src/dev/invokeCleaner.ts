import { CleanerFunction } from "../createCleaner";
import { invokeCronLambda } from "./invokeCronLambda";

const main = async () => {
  await invokeCronLambda(CleanerFunction);
};

main();
