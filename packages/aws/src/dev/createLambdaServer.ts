import cors from "cors";
import express, { raw } from "express";

import { createLambdaEndpoints } from "./createLambdaEndpoints";

export const createLambdaServer = async () => {
  const invocationPort = 3002;

  const host = "localhost";

  const invocationApp = express();
  invocationApp.use(raw());
  invocationApp.use(cors());

  const proxyApp = express();
  proxyApp.use(cors());

  createLambdaEndpoints(invocationApp);

  const invocationServer = invocationApp.listen(invocationPort, host, () => {
    console.info(`Invocation Lambdas at http://${host}:${invocationPort}`);
  });

  return () => {
    invocationServer.close();
  };
};
