import { RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  AttributeType,
  Table,
  BillingMode,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Environment } from "./readEnv";

export const TableOptions = {
  partitionKeyName: "id",
  partitionKeyType: AttributeType.STRING,
  intervalIndexKeyName: "interval",
  intervalIndexKeyType: AttributeType.STRING,
};

export const createTable = (stack: Stack) => {
  const { tableName, intervalIndexName } = Environment;

  const {
    partitionKeyName,
    partitionKeyType,
    intervalIndexKeyName,
    intervalIndexKeyType,
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

  return table;
};
