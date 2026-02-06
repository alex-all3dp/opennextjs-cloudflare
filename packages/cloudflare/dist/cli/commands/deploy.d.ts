import type yargs from "yargs";
import type { WithWranglerArgs } from "./utils.js";
/**
 * Implementation of the `opennextjs-cloudflare deploy` command.
 *
 * @param args
 */
export declare function deployCommand(args: WithWranglerArgs<{
    cacheChunkSize?: number;
}>): Promise<void>;
/**
 * Add the `deploy` command to yargs configuration.
 *
 * Consumes 1 positional parameter.
 */
export declare function addDeployCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
