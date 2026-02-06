/**
 * Gets the path to the Wrangler configuration file if it exists.
 *
 * @param appDir The directory to check for the Wrangler config file
 * @returns The path to Wrangler config file if it exists, undefined otherwise
 */
export declare function findWranglerConfig(appDir: string): string | undefined;
/**
 * Creates a wrangler.jsonc config file in the target directory for the project.
 *
 * If a wrangler.jsonc file already exists it will be overridden.
 *
 * @param projectDir The target directory for the project
 */
export declare function createWranglerConfigFile(projectDir: string): Promise<void>;
