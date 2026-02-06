import type { Queue, QueueMessage } from "@opennextjs/aws/types/overrides.js";
export declare const DEFAULT_REVALIDATION_TIMEOUT_MS = 10000;
/**
 * The Memory Queue offers basic ISR revalidation by directly requesting a revalidation of a route.
 *
 * It offers basic support for in-memory de-duping per isolate.
 *
 * A service binding called `WORKER_SELF_REFERENCE` that points to your worker is required.
 */
export declare class MemoryQueue implements Queue {
    private opts;
    readonly name = "memory-queue";
    revalidatedPaths: Set<string>;
    constructor(opts?: {
        revalidationTimeoutMs: number;
    });
    send({ MessageBody: { host, url }, MessageDeduplicationId }: QueueMessage): Promise<void>;
}
declare const _default: MemoryQueue;
export default _default;
