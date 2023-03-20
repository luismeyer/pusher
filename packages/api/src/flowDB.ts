import { createGetItem, createPutItem, DDBClient } from "duenamodb";

import { Flow } from "@pusher/shared";

DDBClient.params = {
  region: process.env.REGION ?? "eu-central-1",
};

if (process.env.IS_LOCAL) {
  DDBClient.params = {
    region: "localhost",
    endpoint: `http://localhost:3003`,
  };
}

const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

export const saveFlow = createPutItem<Flow>(TABLE_NAME);

export const getFlow = createGetItem<Flow, string>(TABLE_NAME, "id");
