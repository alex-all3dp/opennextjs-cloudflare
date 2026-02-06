import assetResolver from "./overrides/asset-resolver/index.js";
/**
 * Defines the OpenNext configuration that targets the Cloudflare adapter
 *
 * @param config options that enabled you to configure the application's behavior
 * @returns the OpenNext configuration object
 */
export function defineCloudflareConfig(config = {}) {
    const { incrementalCache, tagCache, queue, cachePurge, enableCacheInterception = false, routePreloadingBehavior = "none", } = config;
    return {
        default: {
            override: {
                wrapper: "cloudflare-node",
                converter: "edge",
                proxyExternalRequest: "fetch",
                incrementalCache: resolveIncrementalCache(incrementalCache),
                tagCache: resolveTagCache(tagCache),
                queue: resolveQueue(queue),
                cdnInvalidation: resolveCdnInvalidation(cachePurge),
            },
            routePreloadingBehavior,
        },
        // node:crypto is used to compute cache keys
        edgeExternals: ["node:crypto"],
        cloudflare: {
            useWorkerdCondition: true,
        },
        dangerous: {
            enableCacheInterception,
        },
        middleware: {
            external: true,
            override: {
                wrapper: "cloudflare-edge",
                converter: "edge",
                proxyExternalRequest: "fetch",
                incrementalCache: resolveIncrementalCache(incrementalCache),
                tagCache: resolveTagCache(tagCache),
                queue: resolveQueue(queue),
            },
            assetResolver: () => assetResolver,
        },
    };
}
function resolveIncrementalCache(value = "dummy") {
    if (typeof value === "string") {
        return value;
    }
    return typeof value === "function" ? value : () => value;
}
function resolveTagCache(value = "dummy") {
    if (typeof value === "string") {
        return value;
    }
    return typeof value === "function" ? value : () => value;
}
function resolveQueue(value = "dummy") {
    if (typeof value === "string") {
        return value;
    }
    return typeof value === "function" ? value : () => value;
}
function resolveCdnInvalidation(value = "dummy") {
    if (typeof value === "string") {
        return value;
    }
    return typeof value === "function" ? value : () => value;
}
/**
 * @param buildOpts build options from AWS
 * @returns The OpenConfig specific to cloudflare
 */
export function getOpenNextConfig(buildOpts) {
    return buildOpts.config;
}
/**
 * @returns Unique deployment ID
 */
export function getDeploymentId() {
    return `dpl-${new Date().getTime().toString(36)}`;
}
