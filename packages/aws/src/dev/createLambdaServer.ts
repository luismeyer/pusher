import { join } from "path";
import { Lambda, LambdaMode } from "runl";

import { Request, Server } from "@hapi/hapi";

import { RunnerResult } from "@pusher/shared";

import { RunnerFunction } from "../stack";

export const createLambdaServer = async () => {
  const lambdaPort = 3002;
  const lambdaHost = "localhost";

  const lambdaServer = new Server({
    host: lambdaHost,
    port: lambdaPort,
  });

  const {
    fileName,
    folderPath,
    handlerFunctionName,
    timeoutMins,
    environment,
  } = RunnerFunction;

  const lambda = new Lambda({
    mode: LambdaMode.Persistent,
    lambdaPath: join(folderPath, fileName),
    lambdaHandler: handlerFunctionName,
    lambdaTimeout: timeoutMins ? timeoutMins * 60 * 1000 : undefined,
    autoReload: true,
    environment: {
      IS_LOCAL: "true",
      ...environment,
    },
  });

  lambdaServer.route({
    handler: async (request: Request<{ Payload: Buffer }>, h) => {
      const { payload } = request;

      const event =
        payload.length > 0 ? JSON.parse(payload.toString("utf8")) : {};

      try {
        const result = await lambda.execute<RunnerResult>(event);

        return h.response(JSON.stringify(result)).code(200);
      } catch (error) {
        console.log("Handler Error", error);

        if (error instanceof Error) {
          return h
            .response({
              StatusCode: 500,
              errorMessage: error.message,
              errorType: "Error",
              trace: error.stack?.split("\n"),
            })
            .code(500);
        }

        return h
          .response({
            StatusCode: 500,
            errorMessage: "Unknown error",
            errorType: "Error",
          })
          .code(500);
      }
    },
    method: "POST",
    options: {
      cors: true,
      payload: {
        // allow: ['binary/octet-stream'],
        defaultContentType: "binary/octet-stream",
        // Set maximum size to 6 MB to match maximum invocation payload size in synchronous responses
        maxBytes: 1024 * 1024 * 6,
        // request.payload will be a raw buffer
        parse: false,
      },
      tags: ["api"],
    },
    path: "/2015-03-31/functions/{functionName}/invocations",
  });

  await lambdaServer.start();

  console.info(`Lambda running on http://${lambdaHost}:${lambdaPort}`);

  return async () => {
    await lambdaServer.stop();
    lambda.stop();
  };
};
