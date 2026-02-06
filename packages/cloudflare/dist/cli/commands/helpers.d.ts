import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
import { type GetPlatformProxyOptions } from "wrangler";
export type WorkerEnvVar = Record<keyof CloudflareEnv, string | undefined>;
/**
 * Returns the env vars to use by the CLI.
 *
 * The environments variables are returned from a combination of `process.env`, wrangler config, and `.env*` files.
 *
 * Recommended usage on CI:
 *
 * - Add you secrets to `process.env` (i.e. `CF_ACCOUNT_ID`)
 * - Add public values to the wrangler config `wrangler.jsonc` (i.e. `R2_CACHE_PREFIX_ENV_NAME`)
 *
 * Note: `.dev.vars*` and `.env*` should not be checked in.
 *
 * Recommended usage for local dev:
 *
 * - Add you secrets to either a `.dev.vars*` or `.env*` file (i.e. `CF_ACCOUNT_ID`)
 * - Add public values to the wrangler config `wrangler.jsonc` (i.e. `R2_CACHE_PREFIX_ENV_NAME`)
 *
 * Note: `.env*` files are also used by `next dev` while `.dev.var*` files are only loaded by `wrangler`.
 *
 * Loading details:
 *
 * 1. The variables are first initialized from `process.env`
 * 2. They are then augmented/replaced with variables from the wrangler config (`wrangler.jsonc` and `.dev.vars*`)
 * 3. They are then augmented with variables from `.env*` files (existing values are not replaced).
 *
 * @param options Options to pass to `getPlatformProxy`, i.e. to set the environment
 * @param buildOpts Open Next build options
 * @returns the env vars
 */
export declare function getEnvFromPlatformProxy(options: GetPlatformProxyOptions, buildOpts: BuildOptions): Promise<WorkerEnvVar>;
/**
 * Escape shell metacharacters.
 *
 * When `spawnSync` is invoked with `shell: true`, metacharacters need to be escaped.
 *
 * Based on https://github.com/ljharb/shell-quote/blob/main/quote.js
 *
 * @param arg
 * @returns escaped arg
 */
export declare function quoteShellMeta(arg: string): string;
