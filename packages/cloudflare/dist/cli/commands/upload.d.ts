import type yargs from "yargs";
import type { WithWranglerArgs } from "./utils.js";
/**
 * Implementation of the `opennextjs-cloudflare upload` command.
 *
 * @param args
 */
export declare function uploadCommand(args: WithWranglerArgs<{
    cacheChunkSize?: number;
}>): Promise<void>;
/**
 * Add the `upload` command to yargs configuration.
 *
 * Consumes 1 positional parameter.
 */
export declare function addUploadCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
