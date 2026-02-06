import { debug, error } from "@opennextjs/aws/adapters/logger.js";
import { generateShardId } from "@opennextjs/aws/core/routing/queue.js";
import { IgnorableError } from "@opennextjs/aws/utils/error.js";
import { getCloudflareContext } from "../../cloudflare-context.js";
import { debugCache, isPurgeCacheEnabled, purgeCacheByTags } from "../internal.js";
export const DEFAULT_WRITE_RETRIES = 3;
export const DEFAULT_NUM_SHARDS = 4;
export const NAME = "do-sharded-tag-cache";
const SOFT_TAG_PREFIX = "_N_T_/";
export const DEFAULT_REGION = "enam";
export const AVAILABLE_REGIONS = ["enam", "weur", "apac", "sam", "afr", "oc"];
class ShardedDOTagCache {
    opts;
    mode = "nextMode";
    name = NAME;
    numSoftReplicas;
    numHardReplicas;
    maxWriteRetries;
    enableRegionalReplication;
    defaultRegion;
    localCache;
    constructor(opts = { baseShardSize: DEFAULT_NUM_SHARDS }) {
        this.opts = opts;
        this.numSoftReplicas = opts.shardReplication?.numberOfSoftReplicas ?? 1;
        this.numHardReplicas = opts.shardReplication?.numberOfHardReplicas ?? 1;
        this.maxWriteRetries = opts.maxWriteRetries ?? DEFAULT_WRITE_RETRIES;
        this.enableRegionalReplication = Boolean(opts.shardReplication?.regionalReplication);
        this.defaultRegion = opts.shardReplication?.regionalReplication?.defaultRegion ?? DEFAULT_REGION;
    }
    /**
     * Public API
     */
    async getLastRevalidated(tags) {
        const { isDisabled } = this.getConfig();
        if (isDisabled || tags.length === 0) {
            return 0;
        }
        const deduplicatedTags = Array.from(new Set(tags)); // We deduplicate the tags to avoid unnecessary requests
        try {
            const shardedTagGroups = this.groupTagsByDO({ tags: deduplicatedTags });
            const shardedTagRevalidationOutcomes = await Promise.all(shardedTagGroups.map(async ({ doId, tags }) => {
                const cachedValue = await this.getFromRegionalCache({ doId, tags });
                // If all the value were found in the regional cache, we can just return the max value
                if (cachedValue.length === tags.length) {
                    const timeMs = Math.max(...cachedValue.map((item) => item.time));
                    debugCache("ShardedDOTagCache", `getLastRevalidated tags=${tags} -> ${timeMs} (regional cache)`);
                    return timeMs;
                }
                // Otherwise we need to check the durable object on the ones that were not found in the cache
                const filteredTags = deduplicatedTags.filter((tag) => !cachedValue.some((item) => item.tag === tag));
                const stub = this.getDurableObjectStub(doId);
                const lastRevalidated = await stub.getLastRevalidated(filteredTags);
                const timeMs = Math.max(...cachedValue.map((item) => item.time), lastRevalidated);
                // We then need to populate the regional cache with the missing tags
                getCloudflareContext().ctx.waitUntil(this.putToRegionalCache({ doId, tags }, stub));
                debugCache("ShardedDOTagCache", `getLastRevalidated tags=${tags} -> ${timeMs}`);
                return timeMs;
            }));
            return Math.max(...shardedTagRevalidationOutcomes);
        }
        catch (e) {
            error("Error while checking revalidation", e);
            return 0;
        }
    }
    /**
     * This function checks if the tags have been revalidated
     * It is never supposed to throw and in case of error, it will return false
     * @param tags
     * @param lastModified default to `Date.now()`
     * @returns
     */
    async hasBeenRevalidated(tags, lastModified) {
        const { isDisabled } = this.getConfig();
        if (isDisabled || tags.length === 0) {
            return false;
        }
        try {
            const shardedTagGroups = this.groupTagsByDO({ tags });
            const shardedTagRevalidationOutcomes = await Promise.all(shardedTagGroups.map(async ({ doId, tags }) => {
                const cachedValue = await this.getFromRegionalCache({ doId, tags });
                // If one of the cached values is newer than the lastModified, we can return true
                const cacheHasBeenRevalidated = cachedValue.some((cachedValue) => {
                    return (cachedValue.time ?? 0) > (lastModified ?? Date.now());
                });
                if (cacheHasBeenRevalidated) {
                    debugCache("ShardedDOTagCache", `hasBeenRevalidated tags=${tags} at=${lastModified} -> true (regional cache)`);
                    return true;
                }
                const stub = this.getDurableObjectStub(doId);
                const _hasBeenRevalidated = await stub.hasBeenRevalidated(tags, lastModified);
                const remainingTags = tags.filter((tag) => !cachedValue.some((item) => item.tag === tag));
                if (remainingTags.length > 0) {
                    // We need to put the missing tags in the regional cache
                    getCloudflareContext().ctx.waitUntil(this.putToRegionalCache({ doId, tags: remainingTags }, stub));
                }
                debugCache("ShardedDOTagCache", `hasBeenRevalidated tags=${tags} at=${lastModified} -> ${_hasBeenRevalidated}`);
                return _hasBeenRevalidated;
            }));
            return shardedTagRevalidationOutcomes.some((result) => result);
        }
        catch (e) {
            error("Error while checking revalidation", e);
            return false;
        }
    }
    /**
     * This function writes the tags to the cache
     * Due to the way shards and regional cache are implemented, the regional cache may not be properly invalidated
     * @param tags
     * @returns
     */
    async writeTags(tags) {
        const { isDisabled } = this.getConfig();
        if (isDisabled)
            return;
        // We want to use the same revalidation time for all tags
        const nowMs = Date.now();
        debugCache("ShardedDOTagCache", `writeTags tags=${tags} time=${nowMs}`);
        const shardedTagGroups = this.groupTagsByDO({ tags, generateAllReplicas: true });
        await Promise.all(shardedTagGroups.map(async ({ doId, tags }) => {
            await this.performWriteTagsWithRetry(doId, tags, nowMs);
        }));
        // TODO: See https://github.com/opennextjs/opennextjs-aws/issues/986
        if (isPurgeCacheEnabled()) {
            await purgeCacheByTags(tags);
        }
    }
    /**
     * The following methods are public only because they are accessed from the tests
     */
    async performWriteTagsWithRetry(doId, tags, lastModified, retryNumber = 0) {
        try {
            const stub = this.getDurableObjectStub(doId);
            await stub.writeTags(tags, lastModified);
            // Depending on the shards and the tags, deleting from the regional cache will not work for every tag
            // We also need to delete both cache
            await Promise.all([this.deleteRegionalCache({ doId, tags })]);
        }
        catch (e) {
            error("Error while writing tags", e);
            if (retryNumber >= this.maxWriteRetries) {
                error("Error while writing tags, too many retries");
                // Do we want to throw an error here ?
                await getCloudflareContext().env.NEXT_TAG_CACHE_DO_SHARDED_DLQ?.send({
                    failingShardId: doId.key,
                    failingTags: tags,
                    lastModified,
                });
                return;
            }
            await this.performWriteTagsWithRetry(doId, tags, lastModified, retryNumber + 1);
        }
    }
    getCacheUrlKey(doId, tag) {
        return `http://local.cache/shard/${doId.shardId}?tag=${encodeURIComponent(tag)}`;
    }
    async getCacheInstance() {
        if (!this.localCache && this.opts.regionalCache) {
            this.localCache = await caches.open("sharded-do-tag-cache");
        }
        return this.localCache;
    }
    /**
     * Get the last revalidation time for the tags from the regional cache
     * If the cache is not enabled, it will return an empty array
     * @returns An array of objects with the tag and the last revalidation time
     */
    async getFromRegionalCache(opts) {
        try {
            if (!this.opts.regionalCache)
                return [];
            const cache = await this.getCacheInstance();
            if (!cache)
                return [];
            const result = await Promise.all(opts.tags.map(async (tag) => {
                const cachedResponse = await cache.match(this.getCacheUrlKey(opts.doId, tag));
                if (!cachedResponse)
                    return null;
                const cachedText = await cachedResponse.text();
                try {
                    return { tag, time: parseInt(cachedText, 10) };
                }
                catch (e) {
                    debugCache("Error while parsing cached value", e);
                    return null;
                }
            }));
            return result.filter((item) => item !== null);
        }
        catch (e) {
            error("Error while fetching from regional cache", e);
            return [];
        }
    }
    async putToRegionalCache(optsKey, stub) {
        if (!this.opts.regionalCache)
            return;
        const cache = await this.getCacheInstance();
        if (!cache)
            return;
        const tags = optsKey.tags;
        const tagsLastRevalidated = await stub.getRevalidationTimes(tags);
        await Promise.all(tags.map(async (tag) => {
            let lastRevalidated = tagsLastRevalidated[tag];
            if (lastRevalidated === undefined) {
                if (this.opts.regionalCacheDangerouslyPersistMissingTags) {
                    lastRevalidated = 0; // If the tag is not found, we set it to 0 as it means it has never been revalidated before.
                }
                else {
                    debugCache("Tag not found in revalidation times", { tag, optsKey });
                    return; // If the tag is not found, we skip it
                }
            }
            const cacheKey = this.getCacheUrlKey(optsKey.doId, tag);
            debugCache("Putting to regional cache", { cacheKey, lastRevalidated });
            await cache.put(cacheKey, new Response(lastRevalidated.toString(), {
                status: 200,
                headers: {
                    "cache-control": `max-age=${this.opts.regionalCacheTtlSec ?? 5}`,
                    ...(tags.length > 0
                        ? {
                            "cache-tag": tags.join(","),
                        }
                        : {}),
                },
            }));
        }));
    }
    /**
     * Deletes the regional cache for the given tags
     * This is used to ensure that the cache is cleared when the tags are revalidated
     */
    async deleteRegionalCache(optsKey) {
        // We never want to crash because of the cache
        try {
            if (!this.opts.regionalCache)
                return;
            const cache = await this.getCacheInstance();
            if (!cache)
                return;
            await Promise.all(optsKey.tags.map(async (tag) => {
                const cacheKey = this.getCacheUrlKey(optsKey.doId, tag);
                debugCache("Deleting from regional cache", { cacheKey });
                await cache.delete(cacheKey);
            }));
        }
        catch (e) {
            debugCache("Error while deleting from regional cache", e);
        }
    }
    /**
     * Same tags are guaranteed to be in the same shard
     * @param tags
     * @returns An array of DO ids and tags
     */
    groupTagsByDO({ tags, generateAllReplicas = false, }) {
        // Here we'll start by splitting soft tags from hard tags
        // This will greatly increase the cache hit rate for the soft tag (which are the most likely to cause issue because of load)
        const softTags = this.generateDOIdArray({ tags, shardType: "soft", generateAllReplicas });
        const hardTags = this.generateDOIdArray({ tags, shardType: "hard", generateAllReplicas });
        const tagIdCollection = [...softTags, ...hardTags];
        // We then group the tags by DO id
        const tagsByDOId = new Map();
        for (const { doId, tag } of tagIdCollection) {
            const doIdString = doId.key;
            const tagsArray = tagsByDOId.get(doIdString)?.tags ?? [];
            tagsArray.push(tag);
            tagsByDOId.set(doIdString, {
                // We override the doId here, but it should be the same for all tags
                doId,
                tags: tagsArray,
            });
        }
        const result = Array.from(tagsByDOId.values());
        return result;
    }
    // Private methods
    getDurableObjectStub(doId) {
        const durableObject = getCloudflareContext().env.NEXT_TAG_CACHE_DO_SHARDED;
        if (!durableObject)
            throw new IgnorableError("No durable object binding for cache revalidation");
        const id = durableObject.idFromName(doId.key);
        debug("[shardedTagCache] - Accessing Durable Object : ", {
            key: doId.key,
            region: doId.region,
        });
        return durableObject.get(id, { locationHint: doId.region });
    }
    /**
     * Generates a list of DO ids for the shards and replicas
     * @param tags The tags to generate shards for
     * @param shardType Whether to generate shards for soft or hard tags
     * @param generateAllShards Whether to generate all shards or only one
     * @returns An array of TagCacheDOId and tag
     */
    generateDOIdArray({ tags, shardType, generateAllReplicas = false, }) {
        let replicaIndexes = [1];
        const isSoft = shardType === "soft";
        let numReplicas = 1;
        if (this.opts.shardReplication) {
            numReplicas = isSoft ? this.numSoftReplicas : this.numHardReplicas;
            replicaIndexes = generateAllReplicas
                ? Array.from({ length: numReplicas }, (_, i) => i + 1)
                : [undefined];
        }
        const regionalReplicas = replicaIndexes.flatMap((replicaId) => {
            return tags
                .filter((tag) => (isSoft ? tag.startsWith(SOFT_TAG_PREFIX) : !tag.startsWith(SOFT_TAG_PREFIX)))
                .map((tag) => {
                return {
                    doId: new DOId({
                        baseShardId: generateShardId(tag, this.opts.baseShardSize, "shard"),
                        numberOfReplicas: numReplicas,
                        shardType,
                        replicaId,
                    }),
                    tag,
                };
            });
        });
        if (!this.enableRegionalReplication)
            return regionalReplicas;
        // If we have regional replication enabled, we need to further duplicate the shards in all the regions
        const regionalReplicasInAllRegions = generateAllReplicas
            ? regionalReplicas.flatMap(({ doId, tag }) => {
                return AVAILABLE_REGIONS.map((region) => {
                    return {
                        doId: new DOId({
                            baseShardId: doId.options.baseShardId,
                            numberOfReplicas: numReplicas,
                            shardType,
                            replicaId: doId.replicaId,
                            region,
                        }),
                        tag,
                    };
                });
            })
            : regionalReplicas.map(({ doId, tag }) => {
                doId.region = this.getClosestRegion();
                return { doId, tag };
            });
        return regionalReplicasInAllRegions;
    }
    getClosestRegion() {
        const continent = getCloudflareContext().cf?.continent;
        if (!continent)
            return this.defaultRegion;
        debug("[shardedTagCache] - Continent : ", continent);
        switch (continent) {
            case "AF":
                return "afr";
            case "AS":
                return "apac";
            case "EU":
                return "weur";
            case "NA":
                return "enam";
            case "OC":
                return "oc";
            case "SA":
                return "sam";
            default:
                return this.defaultRegion;
        }
    }
    getConfig() {
        const cfEnv = getCloudflareContext().env;
        const db = cfEnv.NEXT_TAG_CACHE_DO_SHARDED;
        if (!db)
            debugCache("No Durable object found");
        const isDisabled = !!globalThis.openNextConfig
            .dangerous?.disableTagCache;
        return !db || isDisabled
            ? { isDisabled: true }
            : {
                isDisabled: false,
                db,
            };
    }
}
export class DOId {
    options;
    shardId;
    replicaId;
    region;
    constructor(options) {
        this.options = options;
        const { baseShardId, shardType, numberOfReplicas, replicaId, region } = options;
        this.shardId = `tag-${shardType};${baseShardId}`;
        this.replicaId = replicaId ?? this.generateRandomNumberBetween(1, numberOfReplicas);
        this.region = region;
    }
    generateRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    get key() {
        return `${this.shardId};replica-${this.replicaId}${this.region ? `;region-${this.region}` : ""}`;
    }
}
export default (opts) => new ShardedDOTagCache(opts);
