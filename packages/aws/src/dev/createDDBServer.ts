import DynamoDbLocal from "dynamodb-local";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";

import {
  CreateTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

import { TableOptions } from "../createTable";
import { Environment } from "../readEnv";

const tmpPath = resolve(__dirname, "../../../../tmp");

export const createDDBServer = async () => {
  const ddbPort = 3003;
  const ddbPath = resolve(tmpPath, "dynamodb");

  if (!existsSync(ddbPath)) {
    mkdirSync(ddbPath);
  }

  DynamoDbLocal.configureInstaller({
    installPath: resolve(tmpPath, "dynamodb-bin"),
    downloadUrl:
      "https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz",
  });

  await DynamoDbLocal.launch(ddbPort, ddbPath, ["-sharedDb"]);

  const endpoint = `http://localhost:${ddbPort}`;

  console.info(`Dynamodb running on ${endpoint}`);

  // wait for DynamoDB to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const client = new DynamoDBClient({
    region: process.env.REGION ?? "eu-central-1",
    endpoint,
    credentials: {
      accessKeyId: "LOCAL",
      secretAccessKey: "LOCAL",
    },
  });

  const { tableName, intervalIndexName, userIndexName } = Environment;

  const tableExists = await client
    .send(new ListTablesCommand({}))
    .then(({ TableNames }) => TableNames?.includes(tableName));

  if (!tableExists) {
    console.info("Setting up DynamoDB...");

    const {
      intervalIndexKeyName,
      intervalIndexKeyType,
      partitionKeyName,
      partitionKeyType,
      userIndexKeyName,
      userIndexKeyType,
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
          {
            AttributeName: userIndexKeyName,
            AttributeType: userIndexKeyType,
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
          {
            IndexName: userIndexName,
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1,
            },
            KeySchema: [
              {
                AttributeName: userIndexKeyName,
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
