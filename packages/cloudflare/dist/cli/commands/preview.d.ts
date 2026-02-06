import type yargs from "yargs";
import type { WithWranglerArgs } from "./utils.js";
/**
 * Implementation of the `opennextjs-cloudflare preview` command.
 *
 * @param args
 */
export declare function previewCommand(args: WithWranglerArgs<{
    cacheChunkSize?: number;
    remote: boolean;
}>): Promise<void>;
/**
 * Add the `preview` command to yargs configuration.
 *
 * Consumes 1 positional parameter.
 */
export declare function addPreviewCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
