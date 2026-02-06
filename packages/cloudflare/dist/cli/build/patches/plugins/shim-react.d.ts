import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { Plugin } from "esbuild";
/**
 * `react-dom/server.edge` requires:
 * - `react-dom-server.edge.production.js`
 * - `react-dom-server.browser.production.js`
 * - `react-dom-server-legacy.browser.production.js`
 *
 * However only the first one is needed in the Cloudflare Workers environment.
 * The other two can be shimmed to an empty module to reduce the bundle size.
 *
 * @param options Build options
 * @returns An ESBuild plugin that shims unnecessary React modules
 */
export declare function shimReact(options: BuildOptions): Plugin;
