import { createUpdateItem } from "duenamodb";

import { Flow } from "@pusher/shared";

const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

const updateFlow = createUpdateItem<Flow>(TABLE_NAME, "id");

export const increaseFails = (flow: Flow) => {
  const fails = flow.fails + 1;

  return updateFlow({ ...flow, fails }, { updateKeys: ["fails"] });
};
