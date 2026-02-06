import type { Queue, QueueMessage } from "@opennextjs/aws/types/overrides.js";
interface QueueCachingOptions {
    /**
     * The TTL for the regional cache in seconds.
     * @default 5
     */
    regionalCacheTtlSec?: number;
    /**
     * Whether to wait for the queue ack before returning.
     * When set to false, the cache will be populated asap and the queue will be called after.
     * When set to true, the cache will be populated only after the queue ack is received.
     * @default false
     */
    waitForQueueAck?: boolean;
}
declare class QueueCache implements Queue {
    private originalQueue;
    readonly name: string;
    readonly regionalCacheTtlSec: number;
    readonly waitForQueueAck: boolean;
    cache: Cache | undefined;
    localCache: Map<string, number>;
    constructor(originalQueue: Queue, options: QueueCachingOptions);
    send(msg: QueueMessage): Promise<void>;
    private getCache;
    private getCacheUrlString;
    private getCacheKey;
    private putToCache;
    private isInCache;
    /**
     * Remove any value older than the TTL from the local cache
     */
    private clearLocalCache;
}
declare const _default: (originalQueue: Queue, opts?: QueueCachingOptions) => QueueCache;
export default _default;
