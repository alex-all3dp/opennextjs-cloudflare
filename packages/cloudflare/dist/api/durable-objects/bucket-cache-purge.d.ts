import { DurableObject } from "cloudflare:workers";
export declare class BucketCachePurge extends DurableObject<CloudflareEnv> {
    bufferTimeInSeconds: number;
    constructor(state: DurableObjectState, env: CloudflareEnv);
    purgeCacheByTags(tags: string[]): Promise<void>;
    alarm(): Promise<void>;
}
