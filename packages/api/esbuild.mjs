#!/usr/bin/env node
// @ts-check

import { runEsbuild } from "@pusher/esbuild/esbuild.mjs";

await runEsbuild(`src/index.ts`);
