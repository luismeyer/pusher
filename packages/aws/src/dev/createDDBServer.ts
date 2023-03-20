import DynamoDbLocal from "dynamodb-local";

import {
  CreateTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

import { Environment } from "../readEnv";
import { TableOptions } from "../stack";
import { existsSync, mkdirSync } from "fs";

export const createDDBServer = async () => {
  const ddbPort = 3003;
  const ddbPath = "/tmp/dynamodb-pusher";

  if (!existsSync(ddbPath)) {
    mkdirSync(ddbPath);
  }

  await DynamoDbLocal.launch(ddbPort, ddbPath, ["-sharedDb"]);

  const endpoint = `http://localhost:${ddbPort}`;

  console.log(`Dynamodb running on ${endpoint}`);

  // wait for DynamoDB to start
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const client = new DynamoDBClient({
    region: process.env.REGION ?? "eu-central-1",
    endpoint,
    credentials: {
      accessKeyId: "DEFAULT_ACCESS_KEY",
      secretAccessKey: "DEFAULT_SECRET",
    },
  });

  const { tableName, intervalIndexName } = Environment;

  const tableExists = await client
    .send(new ListTablesCommand({}))
    .then(({ TableNames }) => TableNames?.includes(tableName));

  if (!tableExists) {
    console.log("Setting up DynamoDB...");

    const {
      intervalIndexKeyName,
      intervalIndexKeyType,
      partitionKeyName,
      partitionKeyType,
    } = TableOptions;

    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        AttributeDefinitions: [
          {
            AttributeName: partitionKeyName,
            AttributeType: partitionKeyType,
          },
          {
            AttributeName: intervalIndexKeyName,
            AttributeType: intervalIndexKeyType,
          },
        ],
        KeySchema: [
          {
            AttributeName: partitionKeyName,
            KeyType: "HASH",
          },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: intervalIndexName,
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1,
            },
            KeySchema: [
              {
                AttributeName: intervalIndexKeyName,
                KeyType: "HASH",
              },
            ],
          },
        ],
      })
    );

    console.info(`Created table: ${tableName}`);
  }

  return () => {
    DynamoDbLocal.stop(ddbPort);
  };
};