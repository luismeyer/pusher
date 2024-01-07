import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { createBucket } from "./createBucket";
import { createRunner } from "./createRunner";
import { createSchedulers } from "./createSchedulers";
import { createTable } from "./createTable";

export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = createBucket(this);

    const table = createTable(this);

    const runnerLambda = createRunner(this);
    bucket.grantPut(runnerLambda);
    table.grantReadWriteData(runnerLambda);

    createSchedulers(this, table, runnerLambda);
  }
}
