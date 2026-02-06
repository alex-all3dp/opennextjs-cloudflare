import type { CacheEntryType, CacheValue, IncrementalCache, WithLastModified } from "@opennextjs/aws/types/overrides.js";
export declare const NAME = "cf-kv-incremental-cache";
export declare const BINDING_NAME = "NEXT_INC_CACHE_KV";
export declare const PREFIX_ENV_NAME = "NEXT_INC_CACHE_KV_PREFIX";
/**
 * Open Next cache based on Cloudflare KV.
 *
 * The prefix that the cache entries are stored under can be configured with the `NEXT_INC_CACHE_KV_PREFIX`
 * environment variable, and defaults to `incremental-cache`.
 *
 * Note: The class is instantiated outside of the request context.
 * The cloudflare context and process.env are not initialized yet
 * when the constructor is called.
 */
declare class KVIncrementalCache implements IncrementalCache {
    readonly name = "cf-kv-incremental-cache";
    get<CacheType extends CacheEntryType = "cache">(key: string, cacheType?: CacheType): Promise<WithLastModified<CacheValue<CacheType>> | null>;
    set<CacheType extends CacheEntryType = "cache">(key: string, value: CacheValue<CacheType>, cacheType?: CacheType): Promise<void>;
    delete(key: string): Promise<void>;
    protected getKVKey(key: string, cacheType?: CacheEntryType): string;
}
declare const _default: KVIncrementalCache;
export default _default;
