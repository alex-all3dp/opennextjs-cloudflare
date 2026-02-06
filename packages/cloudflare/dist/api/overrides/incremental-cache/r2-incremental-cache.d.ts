import type { CacheEntryType, CacheValue, IncrementalCache, WithLastModified } from "@opennextjs/aws/types/overrides.js";
export declare const NAME = "cf-r2-incremental-cache";
export declare const BINDING_NAME = "NEXT_INC_CACHE_R2_BUCKET";
export declare const PREFIX_ENV_NAME = "NEXT_INC_CACHE_R2_PREFIX";
/**
 * An instance of the Incremental Cache that uses an R2 bucket (`NEXT_INC_CACHE_R2_BUCKET`) as it's
 * underlying data store.
 *
 * The directory that the cache entries are stored in can be configured with the `NEXT_INC_CACHE_R2_PREFIX`
 * environment variable, and defaults to `incremental-cache`.
 */
declare class R2IncrementalCache implements IncrementalCache {
    readonly name = "cf-r2-incremental-cache";
    get<CacheType extends CacheEntryType = "cache">(key: string, cacheType?: CacheType): Promise<WithLastModified<CacheValue<CacheType>> | null>;
    set<CacheType extends CacheEntryType = "cache">(key: string, value: CacheValue<CacheType>, cacheType?: CacheType): Promise<void>;
    delete(key: string): Promise<void>;
    protected getR2Key(key: string, cacheType?: CacheEntryType): string;
}
declare const _default: R2IncrementalCache;
export default _default;
