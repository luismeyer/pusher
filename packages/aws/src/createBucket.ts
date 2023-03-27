import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { Environment } from "./readEnv";

export const createBucket = (stack: Stack) => {
  const { bucketName } = Environment;

  const bucket = new Bucket(stack, bucketName, {
    bucketName,
    publicReadAccess: true,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  return bucket;
};
