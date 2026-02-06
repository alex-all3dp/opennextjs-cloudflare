/**
 * Finds the path to the OpenNext configuration file if it exists.
 *
 * @param appDir The directory to check for the open-next.config.ts file
 * @returns The full path to open-next.config.ts if it exists, undefined otherwise
 */
export declare function findOpenNextConfig(appDir: string): string | undefined;
/**
 * Creates a `open-next.config.ts` file in the target directory for the project.
 *
 * @param appDir The Next application root
 * @return The path to the created source file
 */
export declare function createOpenNextConfigFile(appDir: string): Promise<string>;
