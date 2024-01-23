import {
  createGetItem,
  createPutItem,
  createQueryItems,
  DDBClient,
} from "duenamodb";

import { Flow } from "@pusher/shared";

DDBClient.params = {
  region: process.env.REGION ?? "eu-central-1",
};

if (process.env.IS_LOCAL) {
  DDBClient.params = {
    region: "localhost",
    endpoint: `http://localhost:3003`,
    credentials: { accessKeyId: "LOCAL", secretAccessKey: "LOCAL" },
  };
}

const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

export const saveFlow = createPutItem<Flow>(TABLE_NAME);

export const getFlow = createGetItem<Flow, string>(TABLE_NAME, "id");

const { USER_INDEX_NAME } = process.env;
if (!USER_INDEX_NAME) {
  throw new Error("Missing Env Variable: USER_INDEX_NAME");
}

export const flowsByUser = createQueryItems<Flow, string>(TABLE_NAME, {
  name: USER_INDEX_NAME,
  partitionKeyName: "user",
});
