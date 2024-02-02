import { DDBClient } from "duenamodb";

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

export const TableName = TABLE_NAME;
