import { createUpdateItem, DDBClient } from "duenamodb";

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

const updateFlow = createUpdateItem<Flow>(TABLE_NAME, "id");

export const increaseFails = (flow: Flow) => {
  const fails = flow.fails + 1;

  return updateFlow({ ...flow, fails }, { updateKeys: ["fails"] });
};
