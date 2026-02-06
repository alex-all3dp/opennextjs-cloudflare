import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";
import type { Unstable_Config as WranglerConfig } from "wrangler";
import type yargs from "yargs";
import type { WranglerTarget } from "../utils/run-wrangler.js";
import { type WorkerEnvVar } from "./helpers.js";
export declare function populateCache(buildOpts: BuildOptions, config: OpenNextConfig, wranglerConfig: WranglerConfig, populateCacheOptions: PopulateCacheOptions, envVars: WorkerEnvVar): Promise<void>;
export type CacheAsset = {
    isFetch: boolean;
    fullPath: string;
    key: string;
    buildId: string;
};
export declare function getCacheAssets(opts: BuildOptions): CacheAsset[];
type PopulateCacheOptions = {
    /**
     * Whether to populate the local or remote cache.
     */
    target: WranglerTarget;
    /**
     * Wrangler environment to use.
     */
    environment?: string;
    /**
     * Path to the Wrangler config file.
     */
    wranglerConfigPath?: string;
    /**
     * Chunk sizes to use when populating KV cache. Ignored for R2.
     *
     * @default 25 for KV, 50 for R2
     */
    cacheChunkSize?: number;
    /**
     * Instructs Wrangler to use the preview namespace or ID defined in the Wrangler config for the remote target.
     */
    shouldUsePreviewId: boolean;
};
/**
 * Add the `populateCache` command to yargs configuration, with nested commands for `local` and `remote`.
 *
 * Consumes 2 positional parameters.
 */
export declare function addPopulateCacheCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
export declare function withPopulateCacheOptions<T extends yargs.Argv>(args: T): yargs.Argv<{
    config: string | undefined;
} & {
    configPath: string | undefined;
} & {
    env: string | undefined;
} & {
    cacheChunkSize: number | undefined;
}>;
export {};
