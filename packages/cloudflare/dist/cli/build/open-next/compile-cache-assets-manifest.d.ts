import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { TagCacheMetaFile } from "@opennextjs/aws/types/cache.js";
/**
 * Generates SQL statements that can be used to initialize the cache assets manifest in an SQL data store.
 */
export declare function compileCacheAssetsManifestSqlFile(options: BuildOptions, metaFiles: TagCacheMetaFile[]): void;
