import type { ProjectOptions } from "../../project-options.js";
/**
 * Creates a `wrangler.jsonc` file for the user if a wrangler config file doesn't already exist,
 * but only after asking for the user's confirmation.
 *
 * If the user refuses a warning is shown (which offers ways to opt out of this check to the user).
 *
 * @param projectOpts The options for the project
 */
export declare function createWranglerConfigIfNonExistent(projectOpts: ProjectOptions): Promise<void>;
/**
 * Creates a `open-next.config.ts` file for the user if it doesn't exist, but only after asking for the user's confirmation.
 *
 * If the user refuses an error is thrown (since the file is mandatory).
 *
 * @param sourceDir The source directory for the project
 * @return The path to the created source file
 */
export declare function createOpenNextConfigIfNotExistent(sourceDir: string): Promise<string>;
