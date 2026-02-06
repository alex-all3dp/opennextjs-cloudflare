import type { CacheEntryType, CacheValue, IncrementalCache, WithLastModified } from "@opennextjs/aws/types/overrides.js";
export declare const CACHE_DIR = "cdn-cgi/_next_cache";
export declare const NAME = "cf-static-assets-incremental-cache";
/**
 * This cache uses Workers static assets.
 *
 * It should only be used for applications that do NOT want revalidation and ONLY want to serve prerendered data.
 */
declare class StaticAssetsIncrementalCache implements IncrementalCache {
    readonly name = "cf-static-assets-incremental-cache";
    get<CacheType extends CacheEntryType = "cache">(key: string, cacheType?: CacheType): Promise<WithLastModified<CacheValue<CacheType>> | null>;
    set<CacheType extends CacheEntryType = "cache">(key: string, _value: CacheValue<CacheType>, cacheType?: CacheType): Promise<void>;
    delete(): Promise<void>;
    protected getAssetUrl(key: string, cacheType?: CacheEntryType): string;
}
declare const _default: StaticAssetsIncrementalCache;
export default _default;
