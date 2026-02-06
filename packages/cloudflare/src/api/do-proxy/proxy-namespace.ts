/**
 * Proxy implementation of DurableObjectNamespace that routes RPC calls
 * through a service binding to an external DO worker via HTTP.
 *
 * This enables the main worker to use DOs without having `durable_objects`
 * in its wrangler config, which is required for preview URLs (skew protection).
 */

const DO_RPC_PREFIX = "/do-rpc";

/**
 * A proxy DurableObjectId that carries the name used to create it.
 */
class ProxyDurableObjectId {
	readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	toString(): string {
		return `proxy:${this.name}`;
	}

	equals(other: DurableObjectId): boolean {
		return other instanceof ProxyDurableObjectId && other.name === this.name;
	}
}

/**
 * A proxy DurableObjectStub that serializes method calls as HTTP requests
 * to the DO worker's fetch handler.
 */
function createProxyStub(
	service: Service,
	namespaceName: string,
	doIdName: string,
	locationHint?: string
): DurableObjectStub {
	// Use a Proxy to intercept any method call on the stub
	return new Proxy({} as DurableObjectStub, {
		get(_target, method: string) {
			// Skip internal/symbol properties
			if (typeof method === "symbol") return undefined;
			// Return the id
			if (method === "id") return new ProxyDurableObjectId(doIdName);
			// Return the name
			if (method === "name") return doIdName;

			// For any method call, serialize it as an HTTP request
			return async (...args: unknown[]) => {
				const url = `https://do-proxy${DO_RPC_PREFIX}/${encodeURIComponent(namespaceName)}/${encodeURIComponent(doIdName)}/${encodeURIComponent(method)}`;

				const headers: Record<string, string> = {
					"Content-Type": "application/json",
				};
				if (locationHint) {
					headers["X-DO-Location-Hint"] = locationHint;
				}

				const response = await service.fetch(url, {
					method: "POST",
					headers,
					body: JSON.stringify(args),
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(
						`DO proxy RPC failed: ${namespaceName}.${doIdName}.${method}() -> ${response.status}: ${errorText}`
					);
				}

				const contentType = response.headers.get("Content-Type");
				if (contentType?.includes("application/json")) {
					return response.json();
				}
				// void methods return 204
				return undefined;
			};
		},
	});
}

/**
 * Creates a proxy DurableObjectNamespace that routes all DO operations
 * through a service binding to an external DO worker.
 *
 * The proxy implements `idFromName()` and `get()` to match the
 * DurableObjectNamespace interface used by OpenNext overrides.
 */
export function createProxyDurableObjectNamespace(
	service: Service,
	namespaceName: string
): DurableObjectNamespace {
	return {
		idFromName(name: string): DurableObjectId {
			return new ProxyDurableObjectId(name);
		},

		get(
			id: DurableObjectId,
			options?: DurableObjectNamespaceGetDurableObjectOptions
		): DurableObjectStub {
			const proxyId = id as ProxyDurableObjectId;
			return createProxyStub(
				service,
				namespaceName,
				proxyId.name,
				options?.locationHint
			);
		},

		// Jurisdiction is not commonly used, but provide a basic implementation
		jurisdiction(_jurisdiction: DurableObjectJurisdiction): DurableObjectNamespace {
			return this;
		},

		newUniqueId(_options?: DurableObjectNamespaceNewUniqueIdOptions): DurableObjectId {
			throw new Error("newUniqueId is not supported via DO proxy. Use idFromName instead.");
		},
	} as DurableObjectNamespace;
}

/**
 * Patches the CloudflareEnv object to inject proxy DO namespaces
 * when the `OPENNEXT_DO_WORKER` service binding exists but direct
 * DO bindings are missing.
 *
 * This should be called before the env is stored in the Cloudflare context.
 */
export function injectDOProxyBindings(env: CloudflareEnv): void {
	const doWorkerService = (env as Record<string, unknown>)["OPENNEXT_DO_WORKER"] as
		| Service
		| undefined;

	if (!doWorkerService) return;

	const bindings: Array<{
		key: keyof CloudflareEnv;
		name: string;
	}> = [
		{ key: "NEXT_TAG_CACHE_DO_SHARDED", name: "NEXT_TAG_CACHE_DO_SHARDED" },
		{ key: "NEXT_CACHE_DO_QUEUE", name: "NEXT_CACHE_DO_QUEUE" },
		{ key: "NEXT_CACHE_DO_PURGE", name: "NEXT_CACHE_DO_PURGE" },
	];

	for (const { key, name } of bindings) {
		if (!env[key]) {
			(env as Record<string, unknown>)[key] = createProxyDurableObjectNamespace(
				doWorkerService,
				name
			);
		}
	}
}
