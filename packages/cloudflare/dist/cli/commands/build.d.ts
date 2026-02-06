import type yargs from "yargs";
/**
 * Add the `build` command to yargs configuration.
 *
 * Consumes 1 positional parameter.
 */
export declare function addBuildCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
