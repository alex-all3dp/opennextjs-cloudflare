/**
 * Proxy implementation of DurableObjectNamespace that routes RPC calls
 * through a service binding to an external DO worker via HTTP.
 *
 * This enables the main worker to use DOs without having `durable_objects`
 * in its wrangler config, which is required for preview URLs (skew protection).
 */
/**
 * Creates a proxy DurableObjectNamespace that routes all DO operations
 * through a service binding to an external DO worker.
 *
 * The proxy implements `idFromName()` and `get()` to match the
 * DurableObjectNamespace interface used by OpenNext overrides.
 */
export declare function createProxyDurableObjectNamespace(service: Service, namespaceName: string): DurableObjectNamespace;
/**
 * Patches the CloudflareEnv object to inject proxy DO namespaces
 * when the `OPENNEXT_DO_WORKER` service binding exists but direct
 * DO bindings are missing.
 *
 * This should be called before the env is stored in the Cloudflare context.
 */
export declare function injectDOProxyBindings(env: CloudflareEnv): void;
