import { DurableObject } from "cloudflare:workers";
export declare class DOShardedTagCache extends DurableObject<CloudflareEnv> {
    sql: SqlStorage;
    constructor(state: DurableObjectState, env: CloudflareEnv);
    getLastRevalidated(tags: string[]): Promise<number>;
    hasBeenRevalidated(tags: string[], lastModified?: number): Promise<boolean>;
    writeTags(tags: string[], lastModified: number): Promise<void>;
    getRevalidationTimes(tags: string[]): Promise<Record<string, number>>;
}
