import { APIGatewayProxyResult } from "aws-lambda";
import { Application } from "express";
import { join } from "path";
import { Lambda, LambdaMode } from "runl";

import { FunctionOptions } from "../createFunction";
import { ApiFunction, RunnerFunction } from "../stack";
import { getQueryStringParameters } from "./getQuerystringParameters";
import { getRequestHeaders } from "./getRequestHeaders";

const createLambda = (options: FunctionOptions) => {
  const {
    fileName,
    folderPath,
    handlerFunctionName,
    timeoutMins,
    environment,
  } = options;

  return new Lambda({
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
};

const createInvokeRoute = (app: Application, options: FunctionOptions) => {
  const lambda = createLambda(options);

  app.post(
    "/2015-03-31/functions/:functionName/invocations",
    async (request, response) => {
      const { headers, body } = request;

      const invocationType = headers["x-amz-invocation-type"];

      const event = body.length > 0 ? JSON.parse(body.toString("utf8")) : {};

      try {
        const resultPromise = lambda.execute(event);

        // Don't await async lambda invocations
        if (invocationType === "Event") {
          return response.status(202).send(JSON.stringify({ StatusCode: 202 }));
        }

        const result = await resultPromise;

        return response.status(200).send(JSON.stringify(result));
      } catch (error) {
        console.error("Handler Error", error);

        if (error instanceof Error) {
          return response.status(500).send({
            StatusCode: 500,
            errorMessage: error.message,
            errorType: "Error",
            trace: error.stack?.split("\n"),
          });
        }

        return response.status(500).send({
          StatusCode: 500,
          errorMessage: "Unknown error",
          errorType: "Error",
        });
      }
    }
  );
};

const createProxyRoute = (app: Application, options: FunctionOptions) => {
  app.all("*", async (request, response) => {
    const lambda = createLambda(options);

    const requestBody =
      typeof request.body === `string` && request.body ? request.body : null;

    const result = await lambda.execute<APIGatewayProxyResult>({
      ...getQueryStringParameters(request),
      ...getRequestHeaders(request),
      requestContext: {
        protocol: request.protocol,
        httpMethod: request.method,
        path: request.path,
        resourcePath: request.path,
      },
      path: request.path,
      httpMethod: request.method,
      body: requestBody && Buffer.from(requestBody).toString(`base64`),
      isBase64Encoded: Boolean(requestBody),
    });

    return response
      .type("json")
      .status(result.statusCode)
      .header(result.headers)
      .send(result.body);
  });
};

export const createLambdaEndpoints = (
  invocationApp: Application,
  proxyApp: Application
) => {
  createInvokeRoute(invocationApp, RunnerFunction);

  createProxyRoute(proxyApp, ApiFunction);
};
