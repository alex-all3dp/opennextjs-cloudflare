import type yargs from "yargs";
/**
 * Add the `migrate` command to yargs configuration.
 */
export declare function addMigrateCommand<T extends yargs.Argv>(y: T): yargs.Argv<{}>;
