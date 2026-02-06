/**
 * Inline `findDir` as it relies on `existsSync` which is not supported by workerd.
 */
import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
export declare function inlineFindDir(updater: ContentUpdater, buildOpts: BuildOptions): Plugin;
