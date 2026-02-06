import { error } from "@opennextjs/aws/adapters/logger.js";
import { getCloudflareContext } from "../../cloudflare-context.js";
import { debugCache, FALLBACK_BUILD_ID, isPurgeCacheEnabled, purgeCacheByTags } from "../internal.js";
export const NAME = "d1-next-mode-tag-cache";
export const BINDING_NAME = "NEXT_TAG_CACHE_D1";
export class D1NextModeTagCache {
    mode = "nextMode";
    name = NAME;
    async getLastRevalidated(tags) {
        const { isDisabled, db } = this.getConfig();
        if (isDisabled || tags.length === 0) {
            return 0;
        }
        try {
            const result = await db
                .prepare(`SELECT MAX(revalidatedAt) AS time FROM revalidations WHERE tag IN (${tags.map(() => "?").join(", ")})`)
                .bind(...tags.map((tag) => this.getCacheKey(tag)))
                .run();
            const timeMs = (result.results[0]?.time ?? 0);
            debugCache("D1NextModeTagCache", `getLastRevalidated tags=${tags} -> ${timeMs}`);
            return timeMs;
        }
        catch (e) {
            // By default we don't want to crash here, so we return false
            // We still log the error though so we can debug it
            error(e);
            return 0;
        }
    }
    async hasBeenRevalidated(tags, lastModified) {
        const { isDisabled, db } = this.getConfig();
        if (isDisabled || tags.length === 0) {
            return false;
        }
        try {
            const result = await db
                .prepare(`SELECT 1 FROM revalidations WHERE tag IN (${tags.map(() => "?").join(", ")}) AND revalidatedAt > ? LIMIT 1`)
                .bind(...tags.map((tag) => this.getCacheKey(tag)), lastModified ?? Date.now())
                .raw();
            const revalidated = result.length > 0;
            debugCache("D1NextModeTagCache", `hasBeenRevalidated tags=${tags} at=${lastModified} -> ${revalidated}`);
            return revalidated;
        }
        catch (e) {
            error(e);
            // By default we don't want to crash here, so we return false
            // We still log the error though so we can debug it
            return false;
        }
    }
    async writeTags(tags) {
        const { isDisabled, db } = this.getConfig();
        if (isDisabled || tags.length === 0)
            return Promise.resolve();
        const nowMs = Date.now();
        await db.batch(tags.map((tag) => db
            .prepare(`INSERT INTO revalidations (tag, revalidatedAt) VALUES (?, ?)`)
            .bind(this.getCacheKey(tag), nowMs)));
        debugCache("D1NextModeTagCache", `writeTags tags=${tags} time=${nowMs}`);
        // TODO: See https://github.com/opennextjs/opennextjs-aws/issues/986
        if (isPurgeCacheEnabled()) {
            await purgeCacheByTags(tags);
        }
    }
    getConfig() {
        const db = getCloudflareContext().env[BINDING_NAME];
        if (!db)
            debugCache("No D1 database found");
        const isDisabled = Boolean(globalThis.openNextConfig.dangerous?.disableTagCache);
        return !db || isDisabled
            ? { isDisabled: true }
            : {
                isDisabled: false,
                db,
            };
    }
    getCacheKey(key) {
        return `${this.getBuildId()}/${key}`.replaceAll("//", "/");
    }
    getBuildId() {
        return process.env.NEXT_BUILD_ID ?? FALLBACK_BUILD_ID;
    }
}
export default new D1NextModeTagCache();
