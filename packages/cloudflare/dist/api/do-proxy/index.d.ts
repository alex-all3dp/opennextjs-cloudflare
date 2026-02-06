export { createProxyDurableObjectNamespace, injectDOProxyBindings } from "./proxy-namespace.js";
export { createDOProxyHandler } from "./proxy-handler.js";
/**
 * Wraps an ExportedHandler to inject DO proxy namespaces into env
 * before each request, enabling DO usage without direct DO bindings.
 *
 * Usage:
 * ```ts
 * import { withDOProxy } from "@opennextjs/cloudflare/do-proxy";
 * import openNextHandler from "./.open-next/worker.js";
 *
 * export default withDOProxy(openNextHandler);
 * ```
 */
export declare function withDOProxy(handler: ExportedHandler<CloudflareEnv>): ExportedHandler<CloudflareEnv>;
