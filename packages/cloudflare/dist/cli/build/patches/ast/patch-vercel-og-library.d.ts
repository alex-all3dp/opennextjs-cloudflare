import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
/**
 * Patches the usage of @vercel/og to be compatible with Cloudflare Workers.
 *
 * @param buildOpts Build options.
 * @returns Whether the @vercel/og library is used.
 */
export declare function patchVercelOgLibrary(buildOpts: BuildOptions): boolean;
