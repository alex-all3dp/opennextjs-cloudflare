/**
 * Patch for `next/src/server/route-modules/route-module.ts`
 * https://github.com/vercel/next.js/blob/c8c9bef/packages/next/src/server/route-modules/route-module.ts#L389-L437
 *
 * Patch getIncrementalCache to use a string literal for the cache handler path
 *
 */
import { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
export declare function patchRouteModules(updater: ContentUpdater, buildOpts: BuildOptions): Plugin;
/**
 * The cache handler used by Next.js is normally defined in the config file as a path. At runtime,
 * Next.js would then do a dynamic require on a transformed version of the path to retrieve the
 * cache handler and create a new instance of it.
 *
 * This is problematic in workerd due to the dynamic import of the file that is not known from
 * build-time. Therefore, we have to manually override the default way that the cache handler is
 * instantiated with a dynamic require that uses a string literal for the path.
 */
export declare function getIncrementalCacheRule(handlerPath: string): string;
/**
 * Force trustHostHeader to be true for revalidation
 */
export declare const forceTrustHostHeader = "\nrule:\n  pattern: async function $FN($$$ARGS) { $$$BODY }\n  all:\n    - has:\n        pattern: if ($CONTEXT.trustHostHeader) { $$$_ }\n        stopBy: end\n    - has:\n        regex: \"^x-vercel-protection-bypass$\"\n        stopBy: end\n    - has:\n        regex: \"Invariant: missing internal\"\n        stopBy: end\nfix: |-\n    async function $FN($$$ARGS) {\n      $CONTEXT.trustHostHeader = true;\n      $$$BODY\n    }\n";
