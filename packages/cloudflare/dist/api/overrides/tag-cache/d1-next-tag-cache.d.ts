import type { NextModeTagCache } from "@opennextjs/aws/types/overrides.js";
export declare const NAME = "d1-next-mode-tag-cache";
export declare const BINDING_NAME = "NEXT_TAG_CACHE_D1";
export declare class D1NextModeTagCache implements NextModeTagCache {
    readonly mode: "nextMode";
    readonly name = "d1-next-mode-tag-cache";
    getLastRevalidated(tags: string[]): Promise<number>;
    hasBeenRevalidated(tags: string[], lastModified?: number): Promise<boolean>;
    writeTags(tags: string[]): Promise<void>;
    private getConfig;
    protected getCacheKey(key: string): string;
    protected getBuildId(): string;
}
declare const _default: D1NextModeTagCache;
export default _default;
