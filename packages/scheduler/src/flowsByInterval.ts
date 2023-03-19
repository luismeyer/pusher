import { Flow } from "@pusher/shared";
import { createQueryItems } from "duenamodb";

const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

const { INTERVAL_INDEX_NAME } = process.env;
if (!INTERVAL_INDEX_NAME) {
  throw new Error("Missing Env Variable: INTERVAL_INDEX_NAME");
}

export const flowsByInterval = createQueryItems<Flow, string>(TABLE_NAME, {
  name: INTERVAL_INDEX_NAME,
  partitionKeyName: "interval",
});
