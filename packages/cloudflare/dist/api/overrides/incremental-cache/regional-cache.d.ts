import { CacheEntryType, CacheValue, IncrementalCache, WithLastModified } from "@opennextjs/aws/types/overrides.js";
import { IncrementalCacheEntry } from "../internal.js";
type Options = {
    /**
     * The mode to use for the regional cache.
     *
     * - `short-lived`: Re-use a cache entry for up to a minute after it has been retrieved.
     * - `long-lived`: Re-use a fetch cache entry until it is revalidated (per-region),
     *                 or an ISR/SSG entry for up to 30 minutes.
     */
    mode: "short-lived" | "long-lived";
    /**
     * The default TTL of long-lived cache entries.
     * When no revalidate is provided, the default age will be used.
     *
     * @default `THIRTY_MINUTES_IN_SECONDS`
     */
    defaultLongLivedTtlSec?: number;
    /**
     * Whether the regional cache entry should be updated in the background or not when it experiences
     * a cache hit.
     *
     * @default `true` in `long-lived` mode when cache purge is not used, `false` otherwise.
     */
    shouldLazilyUpdateOnCacheHit?: boolean;
    /**
     * Whether on cache hits the tagCache should be skipped or not. Skipping the tagCache allows requests to be
     * handled faster,
     *
     * Note: When this is enabled, make sure that the cache gets purged
     *       either by enabling the auto cache purging feature or manually.
     *
     * @default `true` if the auto cache purging is enabled, `false` otherwise.
     */
    bypassTagCacheOnCacheHit?: boolean;
};
interface PutToCacheInput {
    key: string;
    cacheType?: CacheEntryType;
    entry: IncrementalCacheEntry<CacheEntryType>;
}
/**
 * Wrapper adding a regional cache on an `IncrementalCache` implementation.
 *
 * Using a the `RegionalCache` does not directly improves the performance much.
 * However it allows bypassing the tag cache (see `bypassTagCacheOnCacheHit`) on hits.
 * That's where bigger perf gain happens.
 *
 * We recommend using cache purge.
 * When cache purge is not enabled, there is a possibility that the Cache API (local to a Data Center)
 * is out of sync with the cache store (i.e. R2). That's why when cache purge is not enabled the Cache
 * API is refreshed from the cache store on cache hits (for the long-lived mode).
 */
declare class RegionalCache implements IncrementalCache {
    #private;
    private store;
    private opts;
    name: string;
    protected localCache: Cache | undefined;
    constructor(store: IncrementalCache, opts: Options);
    get<CacheType extends CacheEntryType = "cache">(key: string, cacheType?: CacheType): Promise<WithLastModified<CacheValue<CacheType>> | null>;
    set<CacheType extends CacheEntryType = "cache">(key: string, value: CacheValue<CacheType>, cacheType?: CacheType): Promise<void>;
    delete(key: string): Promise<void>;
    protected getCacheInstance(): Promise<Cache>;
    protected getCacheUrlKey(key: string, cacheType?: CacheEntryType): string;
    protected putToCache({ key, cacheType, entry }: PutToCacheInput): Promise<void>;
}
/**
 * A regional cache will wrap an incremental cache and provide faster cache lookups for an entry
 * when making requests within the region.
 *
 * The regional cache uses the Cache API.
 *
 * **WARNING:**
 * If an entry is revalidated on demand in one region (using either `revalidateTag`, `revalidatePath` or `res.revalidate` ), it will trigger an additional revalidation if
 * a request is made to another region that has an entry stored in its regional cache.
 *
 * @param cache Incremental cache instance.
 * @param opts Options for the regional cache.
 */
export declare function withRegionalCache(cache: IncrementalCache, opts: Options): RegionalCache;
export {};
