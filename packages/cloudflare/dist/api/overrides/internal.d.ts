import type { CacheEntryType, CacheValue } from "@opennextjs/aws/types/overrides.js";
export type IncrementalCacheEntry<CacheType extends CacheEntryType> = {
    value: CacheValue<CacheType>;
    lastModified: number;
};
export declare const debugCache: (name: string, ...args: unknown[]) => void;
export declare const FALLBACK_BUILD_ID = "no-build-id";
export declare const DEFAULT_PREFIX = "incremental-cache";
export type KeyOptions = {
    cacheType?: CacheEntryType;
    prefix: string | undefined;
    buildId: string | undefined;
};
export declare function computeCacheKey(key: string, options: KeyOptions): string;
export declare function isPurgeCacheEnabled(): boolean;
export declare function purgeCacheByTags(tags: string[]): Promise<void>;
export declare function internalPurgeCacheByTags(env: CloudflareEnv, tags: string[]): Promise<"missing-credentials" | "rate-limit-exceeded" | "purge-failed" | "purge-success">;
