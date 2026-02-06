import { NextModeTagCache } from "@opennextjs/aws/types/overrides.js";
interface WithFilterOptions {
    /**
     * The original tag cache.
     * Call to this will receive only the filtered tags.
     */
    tagCache: NextModeTagCache;
    /**
     * The function to filter tags.
     * @param tag The tag to filter.
     * @returns true if the tag should be forwarded, false otherwise.
     */
    filterFn: (tag: string) => boolean;
}
/**
 * Creates a new tag cache that filters tags based on the provided filter function.
 * This is useful to remove tags that are not used by the app, this could reduce the number of requests to the underlying tag cache.
 */
export declare function withFilter({ tagCache, filterFn }: WithFilterOptions): NextModeTagCache;
/**
 * Filter function to exclude tags that start with "_N_T_".
 * This is used to filter out internal soft tags.
 * Can be used if `revalidatePath` is not used.
 */
export declare function softTagFilter(tag: string): boolean;
export {};
