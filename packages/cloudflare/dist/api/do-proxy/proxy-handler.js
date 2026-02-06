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
const DO_RPC_PREFIX = "/do-rpc";
/**
 * Map of binding names to the DurableObjectNamespace keys in CloudflareEnv.
 * The proxy handler uses these to look up the correct namespace.
 */
const NAMESPACE_BINDINGS = [
    "NEXT_TAG_CACHE_DO_SHARDED",
    "NEXT_CACHE_DO_QUEUE",
    "NEXT_CACHE_DO_PURGE",
];
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
export function createDOProxyHandler() {
    return {
        async fetch(request, env) {
            const url = new URL(request.url);
            // Only handle DO RPC requests
            if (!url.pathname.startsWith(DO_RPC_PREFIX)) {
                return new Response("Not Found", { status: 404 });
            }
            if (request.method !== "POST") {
                return new Response("Method Not Allowed", { status: 405 });
            }
            // Parse the path: /do-rpc/{namespace}/{doIdName}/{method}
            const pathParts = url.pathname
                .slice(DO_RPC_PREFIX.length + 1)
                .split("/")
                .map(decodeURIComponent);
            if (pathParts.length !== 3) {
                return new Response(`Invalid RPC path. Expected /do-rpc/{namespace}/{doIdName}/{method}, got ${url.pathname}`, { status: 400 });
            }
            const namespaceName = pathParts[0];
            const doIdName = pathParts[1];
            const method = pathParts[2];
            // Validate namespace
            if (!NAMESPACE_BINDINGS.includes(namespaceName)) {
                return new Response(`Unknown DO namespace: ${namespaceName}`, { status: 404 });
            }
            // Get the DO namespace from env
            const namespace = env[namespaceName];
            if (!namespace) {
                return new Response(`DO namespace ${namespaceName} not bound in DO worker env`, { status: 500 });
            }
            try {
                // Create the DO stub
                const id = namespace.idFromName(doIdName);
                const locationHint = request.headers.get("X-DO-Location-Hint");
                const stub = locationHint
                    ? namespace.get(id, { locationHint })
                    : namespace.get(id);
                // Parse arguments
                const args = (await request.json());
                // Call the method on the stub
                const result = await stub[method](...args);
                // Return the result
                if (result === undefined || result === null) {
                    return new Response(null, { status: 204 });
                }
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.error(`DO proxy handler error: ${namespaceName}.${doIdName}.${method}():`, err);
                return new Response(message, { status: 500 });
            }
        },
    };
}
