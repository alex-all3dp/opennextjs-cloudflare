import { error } from "@opennextjs/aws/adapters/logger.js";
const DEFAULT_QUEUE_CACHE_TTL_SEC = 5;
class QueueCache {
    originalQueue;
    name;
    regionalCacheTtlSec;
    waitForQueueAck;
    cache;
    // Local mapping from key to insertedAtSec
    localCache = new Map();
    constructor(originalQueue, options) {
        this.originalQueue = originalQueue;
        this.name = `cached-${originalQueue.name}`;
        this.regionalCacheTtlSec = options.regionalCacheTtlSec ?? DEFAULT_QUEUE_CACHE_TTL_SEC;
        this.waitForQueueAck = options.waitForQueueAck ?? false;
    }
    async send(msg) {
        try {
            const isCached = await this.isInCache(msg);
            if (isCached) {
                return;
            }
            if (!this.waitForQueueAck) {
                await this.putToCache(msg);
                await this.originalQueue.send(msg);
            }
            else {
                await this.originalQueue.send(msg);
                await this.putToCache(msg);
            }
        }
        catch (e) {
            error("Error sending message to queue", e);
        }
        finally {
            this.clearLocalCache();
        }
    }
    async getCache() {
        if (!this.cache) {
            this.cache = await caches.open("durable-queue");
        }
        return this.cache;
    }
    getCacheUrlString(msg) {
        return `queue/${msg.MessageGroupId}/${msg.MessageDeduplicationId}`;
    }
    getCacheKey(msg) {
        return "http://local.cache" + this.getCacheUrlString(msg);
    }
    async putToCache(msg) {
        this.localCache.set(this.getCacheUrlString(msg), Date.now());
        const cacheKey = this.getCacheKey(msg);
        const cache = await this.getCache();
        await cache.put(cacheKey, new Response(null, {
            status: 200,
            headers: {
                "Cache-Control": `max-age=${this.regionalCacheTtlSec}`,
                // Tag cache is set to the value of the soft tag assigned by Next.js
                // This way you can invalidate this cache as well as any other regional cache
                "Cache-Tag": `_N_T_/${msg.MessageBody.url}`,
            },
        }));
    }
    async isInCache(msg) {
        if (this.localCache.has(this.getCacheUrlString(msg))) {
            const insertedAt = this.localCache.get(this.getCacheUrlString(msg));
            if (Date.now() - insertedAt < this.regionalCacheTtlSec * 1000) {
                return true;
            }
            this.localCache.delete(this.getCacheUrlString(msg));
            return false;
        }
        const cacheKey = this.getCacheKey(msg);
        const cache = await this.getCache();
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            return true;
        }
    }
    /**
     * Remove any value older than the TTL from the local cache
     */
    clearLocalCache() {
        const insertAtSecMax = Date.now() - this.regionalCacheTtlSec * 1000;
        for (const [key, insertAtSec] of this.localCache.entries()) {
            if (insertAtSec < insertAtSecMax) {
                this.localCache.delete(key);
            }
        }
    }
}
export default (originalQueue, opts = {}) => new QueueCache(originalQueue, opts);
