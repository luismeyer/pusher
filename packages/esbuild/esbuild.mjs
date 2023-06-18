#!/usr/bin/env node
// @ts-check

import { build, context } from "esbuild";

const [, , ...args] = process.argv;
const minify = args.includes(`--minify`);
const watch = args.includes(`--watch`);

/**
 *
 * @param {string} entry
 * @param {?Partial<import('esbuild').BuildOptions>} additionalBuildOptions
 */
export async function runEsbuild(entry, additionalBuildOptions = {}) {
  /**
   * @type {import('esbuild').BuildOptions}
   */
  const buildOptions = {
    entryPoints: [entry],
    outdir: `dist`,
    bundle: true,
    platform: `node`,
    target: `node18`,
    format: `cjs`,
    sourcemap: true,
    minify,
    logLevel: `info`,
    ...additionalBuildOptions,
  };

  try {
    if (watch) {
      const buildContext = await context(buildOptions);

      await buildContext.watch();
    } else {
      await build(buildOptions);
    }
  } catch {
    process.exit(1);
  }
}
