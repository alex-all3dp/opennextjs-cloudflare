import type { QueueMessage } from "@opennextjs/aws/types/overrides.js";
import { DurableObject } from "cloudflare:workers";
interface FailedState {
    msg: QueueMessage;
    retryCount: number;
    nextAlarmMs: number;
}
export declare class DOQueueHandler extends DurableObject<CloudflareEnv> {
    ongoingRevalidations: Map<string, Promise<void>>;
    sql: SqlStorage;
    routeInFailedState: Map<string, FailedState>;
    service: NonNullable<CloudflareEnv["WORKER_SELF_REFERENCE"]>;
    readonly maxRevalidations: number;
    readonly revalidationTimeout: number;
    readonly revalidationRetryInterval: number;
    readonly maxRetries: number;
    readonly disableSQLite: boolean;
    constructor(ctx: DurableObjectState, env: CloudflareEnv);
    revalidate(msg: QueueMessage): Promise<void>;
    executeRevalidation(msg: QueueMessage): Promise<void>;
    alarm(): Promise<void>;
    addToFailedState(msg: QueueMessage): Promise<void>;
    addAlarm(): Promise<void>;
    initState(): Promise<void>;
    /**
     *
     * @param msg
     * @returns `true` if the route has been revalidated since the lastModified from the message, `false` otherwise
     */
    checkSyncTable(msg: QueueMessage): boolean;
}
export {};
