import cors from "cors";
import express, { raw } from "express";

import { createLambdaEndpoints } from "./createLambdaEndpoints";

const { NEXT_PUBLIC_API_URL } = process.env;
if (!NEXT_PUBLIC_API_URL) {
  throw new Error("Environment Var API_URL is not set");
}

const { port: proxyPort } = new URL(NEXT_PUBLIC_API_URL);

export const createLambdaServer = async () => {
  const invocationPort = 3002;

  const host = "localhost";

  const invocationApp = express();
  invocationApp.use(raw());
  invocationApp.use(cors());

  const proxyApp = express();
  proxyApp.use(cors());

  createLambdaEndpoints(invocationApp, proxyApp);

  const invocationServer = invocationApp.listen(invocationPort, host, () => {
    console.info(`Invocation Lambdas at http://${host}:${invocationPort}`);
  });

  const proxyServer = proxyApp.listen(proxyPort, () => {
    console.info(`Proxy Lambdas at http://${host}:${proxyPort}`);
  });

  return () => {
    invocationServer.close();
    proxyServer.close();
  };
};
