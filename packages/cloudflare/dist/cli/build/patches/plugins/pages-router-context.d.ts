/**
 * ESBuild plugin to handle pages router context.
 *
 * We need to change the import path for the pages router context to use the one provided in `pages-runtime.prod.js`
 */
import { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { PluginBuild } from "esbuild";
export declare function patchPagesRouterContext(buildOpts: BuildOptions): {
    name: string;
    setup: (build: PluginBuild) => void;
};
