#!/usr/bin/env node
import "source-map-support/register";

import * as cdk from "aws-cdk-lib";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { existsSync } from "node:fs";

import { AwsStack } from "./stack";

export const chromiumLayerPath = `${tmpdir()}/chromium-layer.zip`;

const loadChromium = async () => {
  if (existsSync(chromiumLayerPath)) {
    console.info("Chromium layer already exists");
    return;
  }

  console.info("Loading chromium layer");

  const { CHROMIUM_URL } = process.env;
  if (!CHROMIUM_URL) {
    throw new Error("CHROMIUM_URL is not defined");
  }

  const response = await fetch(CHROMIUM_URL);

  if (!response.ok || !response.body) {
    throw new Error("Failed to download chromium layer");
  }

  console.info("Writing chromium layer to ", chromiumLayerPath);
  await writeFile(chromiumLayerPath, response.body);
};

const main = async () => {
  await loadChromium();

  const app = new cdk.App();
  new AwsStack(app, "PusherStack", {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    env: { region: "eu-central-1" },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  });
};

main();
