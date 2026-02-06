/**
 * Fetch handler for the DO worker that routes proxy RPC requests
 * from the main worker to the appropriate Durable Object stubs.
 *
 * Usage in do-worker.ts:
 * ```ts
 * import { createDOProxyHandler } from "@opennextjs/cloudflare/do-proxy";
 * export { DOQueueHandler } from "./.open-next/worker.js";
 * export { DOShardedTagCache } from "./.open-next/worker.js";
 * export { BucketCachePurge } from "./.open-next/worker.js";
 * export default createDOProxyHandler();
 * ```
 */
/**
 * Creates a fetch handler that routes DO proxy RPC requests to local DO stubs.
 *
 * The handler expects requests in the format:
 *   POST /do-rpc/{namespaceName}/{doIdName}/{method}
 *   Body: JSON array of arguments
 *   Headers: X-DO-Location-Hint (optional)
 *
 * Returns:
 *   - 200 with JSON body for methods that return a value
 *   - 204 for void methods
 *   - 400/404/500 for errors
 */
export declare function createDOProxyHandler(): ExportedHandler<CloudflareEnv>;
