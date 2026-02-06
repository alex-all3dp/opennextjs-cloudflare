/**
 * Inline `loadManifest` and `evalManifest` from `load-manifest.js`
 *
 * They rely on `readFileSync` that is not supported by workerd.
 */
import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
export declare function inlineLoadManifest(updater: ContentUpdater, buildOpts: BuildOptions): Plugin;
