import type yargs from "yargs";
import type { OpenNextConfig } from "../../api/config.js";
export type WithWranglerArgs<T = unknown> = T & {
    wranglerArgs: string[];
    wranglerConfigPath: string | undefined;
    env: string | undefined;
};
export declare const nextAppDir: string;
/**
 * Print headers and warnings for the CLI.
 *
 * @param command
 */
export declare function printHeaders(command: string): void;
/**
 * Compile the OpenNext config.
 *
 * When users do not specify a custom config file (using `--openNextConfigPath`),
 * the CLI will offer to create one.
 *
 * When users specify a custom config file but it doesn't exist, we throw an Error.
 *
 * @param configPath Optional path to the config file. Absolute or relative to cwd.
 * @returns OpenNext config.
 */
export declare function compileConfig(configPath: string | undefined): Promise<{
    config: import("@opennextjs/aws/types/open-next.js").OpenNextConfig;
    buildDir: string;
}>;
/**
 * Retrieve a compiled OpenNext config, and ensure it is for Cloudflare.
 *
 * @returns OpenNext config.
 */
export declare function retrieveCompiledConfig(): Promise<{
    config: any;
}>;
/**
 * Normalize the OpenNext options and set the logging level.
 *
 * @param config
 * @param buildDir Directory to use when building the application
 * @returns Normalized options.
 */
export declare function getNormalizedOptions(config: OpenNextConfig, buildDir?: string): {
    appBuildOutputPath: string;
    appPackageJsonPath: string;
    appPath: string;
    appPublicPath: string;
    buildDir: string;
    config: import("@opennextjs/aws/types/open-next.js").OpenNextConfig;
    debug: boolean;
    minify: boolean;
    monorepoRoot: string;
    nextVersion: string;
    openNextVersion: string;
    openNextDistDir: string;
    outputDir: string;
    packager: "npm" | "pnpm" | "yarn" | "bun";
    tempBuildDir: string;
};
/**
 * Read the Wrangler config.
 *
 * @param args Wrangler environment and config path.
 * @returns Wrangler config.
 */
export declare function readWranglerConfig(args: WithWranglerArgs): Promise<Config$1>;
/**
 * Adds flags for the wrangler config path and environment to the yargs configuration.
 */
export declare function withWranglerOptions<T extends yargs.Argv>(args: T): yargs.Argv<{
    config: string | undefined;
} & {
    configPath: string | undefined;
} & {
    env: string | undefined;
}>;
type WranglerInputArgs = {
    configPath: string | undefined;
    config: string | undefined;
    env: string | undefined;
    remote?: boolean | undefined;
};
/**
 *
 * @param args
 * @returns The inputted args, and an array of arguments that can be given to wrangler commands, including the `--config` and `--env` args.
 */
export declare function withWranglerPassthroughArgs<T extends yargs.ArgumentsCamelCase<WranglerInputArgs>>(args: T): WithWranglerArgs<T>;
export {};
