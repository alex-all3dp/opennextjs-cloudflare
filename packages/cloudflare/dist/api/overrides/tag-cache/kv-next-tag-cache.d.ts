import type { NextModeTagCache } from "@opennextjs/aws/types/overrides.js";
export declare const NAME = "kv-next-mode-tag-cache";
export declare const BINDING_NAME = "NEXT_TAG_CACHE_KV";
/**
 * Tag Cache based on a KV namespace
 *
 * Warning:
 * This implementation is considered experimental for now.
 * KV is eventually consistent and can take up to 60s to reflect the last write.
 * This means that:
 * - revalidations can take up to 60s to apply
 * - when a page depends on multiple tags they can be inconsistent for up to 60s.
 *   It also means that cached data could be outdated for one tag when other tags
 *   are revalidated resulting in the page being generated based on outdated data.
 */
export declare class KVNextModeTagCache implements NextModeTagCache {
    #private;
    readonly mode: "nextMode";
    readonly name = "kv-next-mode-tag-cache";
    getLastRevalidated(tags: string[]): Promise<number>;
    hasBeenRevalidated(tags: string[], lastModified?: number): Promise<boolean>;
    writeTags(tags: string[]): Promise<void>;
    /**
     * Returns the KV namespace when it exists and tag cache is not disabled.
     *
     * @returns KV namespace or undefined
     */
    private getKv;
    protected getCacheKey(key: string): string;
    protected getBuildId(): string;
}
declare const _default: KVNextModeTagCache;
export default _default;
