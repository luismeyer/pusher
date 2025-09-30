import { Duration, RemovalPolicy, type Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { Environment } from "./readEnv";

export const createBucket = (stack: Stack) => {
  const { bucketName } = Environment;

  const bucket = new Bucket(stack, bucketName, {
    bucketName,
    publicReadAccess: true,
    blockPublicAccess: {
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    },
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    lifecycleRules: [
      {
        enabled: true,
        tagFilters: { delete: "true" },
        expiration: Duration.days(3),
      },
    ],
  });

  return bucket;
};
