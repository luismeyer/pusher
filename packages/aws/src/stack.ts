import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { createApi } from "./createApi";
import { createBucket } from "./createBucket";
import { createCleaner } from "./createCleaner";
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

    const apiLambda = createApi(this);
    table.grantReadWriteData(apiLambda);
    runnerLambda.grantInvoke(apiLambda);

    const cleanerLambda = createCleaner(this);
    bucket.grantDelete(cleanerLambda);
    bucket.grantRead(cleanerLambda);

    createSchedulers(this, table, runnerLambda);
  }
}
