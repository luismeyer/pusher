import { createGetItem, createPutItem, createQueryItems } from "duenamodb";

import type { Flow } from "@pusher/shared";

import { TableName } from "./db";

export const saveFlow = createPutItem<Flow>(TableName);

export const getFlow = createGetItem<Flow, string>(TableName, "id");

const { USER_INDEX_NAME } = process.env;
if (!USER_INDEX_NAME) {
  throw new Error("Missing Env Variable: USER_INDEX_NAME");
}

export const flowsByUser = createQueryItems<Flow, string>(TableName, {
  name: USER_INDEX_NAME,
  partitionKeyName: "user",
});
