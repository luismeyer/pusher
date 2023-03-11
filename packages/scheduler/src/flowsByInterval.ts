import { Flow } from "@pusher/shared";
import { createQueryItems } from "duenamodb";

const { TABLE_NAME } = process.env;
if (!TABLE_NAME) {
  throw new Error("Missing Env Variable: TABLE_NAME");
}

export const flowsByInterval = createQueryItems<Flow, string>(TABLE_NAME, {
  name: "IntervalIndex",
  partitionKeyName: "interval",
});
