import { RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  AttributeType,
  Table,
  BillingMode,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Environment } from "./readEnv";

const { tableName, intervalIndexName, userIndexName } = Environment;

export const TableOptions = {
  partitionKeyName: "id",
  partitionKeyType: AttributeType.STRING,
  intervalIndexKeyName: "interval",
  intervalIndexKeyType: AttributeType.STRING,
  userIndexKeyName: "user",
  userIndexKeyType: AttributeType.STRING,
};

export const createTable = (stack: Stack) => {
  const {
    partitionKeyName,
    partitionKeyType,
    intervalIndexKeyName,
    intervalIndexKeyType,
    userIndexKeyName,
    userIndexKeyType,
  } = TableOptions;

  const table = new Table(stack, tableName, {
    tableName,
    partitionKey: {
      name: partitionKeyName,
      type: partitionKeyType,
    },
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  table.addGlobalSecondaryIndex({
    indexName: intervalIndexName,
    projectionType: ProjectionType.ALL,
    partitionKey: {
      name: intervalIndexKeyName,
      type: intervalIndexKeyType,
    },
  });

  table.addGlobalSecondaryIndex({
    indexName: userIndexName,
    projectionType: ProjectionType.ALL,
    partitionKey: {
      name: userIndexKeyName,
      type: userIndexKeyType,
    },
  });

  return table;
};
