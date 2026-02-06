import type { GetPlatformProxyOptions } from "wrangler";
import type { BucketCachePurge } from "./durable-objects/bucket-cache-purge.js";
import type { DOQueueHandler } from "./durable-objects/queue.js";
import type { DOShardedTagCache } from "./durable-objects/sharded-tag-cache.js";
import type { PREFIX_ENV_NAME as KV_CACHE_PREFIX_ENV_NAME } from "./overrides/incremental-cache/kv-incremental-cache.js";
import type { PREFIX_ENV_NAME as R2_CACHE_PREFIX_ENV_NAME } from "./overrides/incremental-cache/r2-incremental-cache.js";
declare global {
    interface CloudflareEnv {
        ASSETS?: Fetcher;
        IMAGES?: ImagesBinding;
        NEXTJS_ENV?: string;
        WORKER_SELF_REFERENCE?: Service;
        NEXT_INC_CACHE_KV?: KVNamespace;
        [KV_CACHE_PREFIX_ENV_NAME]?: string;
        NEXT_INC_CACHE_R2_BUCKET?: R2Bucket;
        [R2_CACHE_PREFIX_ENV_NAME]?: string;
        NEXT_TAG_CACHE_D1?: D1Database;
        NEXT_TAG_CACHE_KV?: KVNamespace;
        NEXT_TAG_CACHE_DO_SHARDED?: DurableObjectNamespace<DOShardedTagCache>;
        NEXT_TAG_CACHE_DO_SHARDED_DLQ?: Queue;
        NEXT_CACHE_DO_QUEUE?: DurableObjectNamespace<DOQueueHandler>;
        NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION?: string;
        NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS?: string;
        NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS?: string;
        NEXT_CACHE_DO_QUEUE_MAX_RETRIES?: string;
        NEXT_CACHE_DO_QUEUE_DISABLE_SQLITE?: string;
        NEXT_CACHE_DO_PURGE?: DurableObjectNamespace<BucketCachePurge>;
        NEXT_CACHE_DO_PURGE_BUFFER_TIME_IN_SECONDS?: string;
        CACHE_PURGE_ZONE_ID?: string;
        CACHE_PURGE_API_TOKEN?: string;
        OPENNEXT_DO_WORKER?: Service;
        CF_WORKER_NAME?: string;
        CF_PREVIEW_DOMAIN?: string;
        CF_WORKERS_SCRIPTS_API_TOKEN?: string;
        CF_ACCOUNT_ID?: string;
    }
}
export type CloudflareContext<CfProperties extends Record<string, unknown> = IncomingRequestCfProperties, Context = ExecutionContext> = {
    /**
     * the worker's [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
     */
    env: CloudflareEnv;
    /**
     * the request's [cf properties](https://developers.cloudflare.com/workers/runtime-apis/request/#the-cf-property-requestinitcfproperties)
     */
    cf: CfProperties | undefined;
    /**
     * the current [execution context](https://developers.cloudflare.com/workers/runtime-apis/context)
     */
    ctx: Context;
};
/**
 * Utility to get the current Cloudflare context
 *
 * @returns the cloudflare context
 */
export declare function getCloudflareContext<CfProperties extends Record<string, unknown> = IncomingRequestCfProperties, Context = ExecutionContext>(options: {
    async: true;
}): Promise<CloudflareContext<CfProperties, Context>>;
export declare function getCloudflareContext<CfProperties extends Record<string, unknown> = IncomingRequestCfProperties, Context = ExecutionContext>(options?: {
    async: false;
}): CloudflareContext<CfProperties, Context>;
/**
 * Performs some initial setup to integrate as best as possible the local Next.js dev server (run via `next dev`)
 * with the open-next Cloudflare adapter
 *
 * Note: this function should only be called inside the Next.js config file, and although async it doesn't need to be `await`ed
 * @param options options on how the function should operate and if/where to persist the platform data
 */
export declare function initOpenNextCloudflareForDev(options?: GetPlatformProxyOptions): Promise<void>;
