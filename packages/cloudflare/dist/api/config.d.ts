import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import { BaseOverride, LazyLoadedOverride, OpenNextConfig as AwsOpenNextConfig, type RoutePreloadingBehavior } from "@opennextjs/aws/types/open-next.js";
import type { CDNInvalidationHandler, IncrementalCache, Queue, TagCache } from "@opennextjs/aws/types/overrides.js";
export type Override<T extends BaseOverride> = "dummy" | T | LazyLoadedOverride<T>;
/**
 * Cloudflare specific overrides.
 *
 * See the [Caching documentation](https://opennext.js.org/cloudflare/caching))
 */
export type CloudflareOverrides = {
    /**
     * Sets the incremental cache implementation.
     */
    incrementalCache?: Override<IncrementalCache>;
    /**
     * Sets the tag cache implementation.
     */
    tagCache?: Override<TagCache>;
    /**
     * Sets the revalidation queue implementation
     */
    queue?: "direct" | Override<Queue>;
    /**
     * Sets the automatic cache purge implementation
     */
    cachePurge?: Override<CDNInvalidationHandler>;
    /**
     * Enable cache interception
     * Should be `false` when PPR is used
     * @default false
     */
    enableCacheInterception?: boolean;
    /**
     * Route preloading behavior.
     * Using a value other than "none" can result in higher CPU usage on cold starts.
     * @default "none"
     */
    routePreloadingBehavior?: RoutePreloadingBehavior;
};
/**
 * Defines the OpenNext configuration that targets the Cloudflare adapter
 *
 * @param config options that enabled you to configure the application's behavior
 * @returns the OpenNext configuration object
 */
export declare function defineCloudflareConfig(config?: CloudflareOverrides): OpenNextConfig;
interface OpenNextConfig extends AwsOpenNextConfig {
    cloudflare?: {
        /**
         * Whether to use the "workerd" build conditions when bundling the server.
         * It is recommended to set it to `true` so that code specifically targeted to the
         * workerd runtime is bundled.
         *
         * See https://esbuild.github.io/api/#conditions
         *
         * @default true
         */
        useWorkerdCondition?: boolean;
        /**
         * Disable throwing an error when the config validation fails.
         * This is useful for overriding some of the default provided by cloudflare.
         * **USE AT YOUR OWN RISK**
         * @default false
         */
        dangerousDisableConfigValidation?: boolean;
        /**
         * Skew protection.
         *
         * Note: Skew Protection is experimental and might break on minor releases.
         *
         * @default false
         */
        skewProtection?: {
            enabled?: boolean;
            maxNumberOfVersions?: number;
            maxVersionAgeDays?: number;
        };
    };
}
/**
 * @param buildOpts build options from AWS
 * @returns The OpenConfig specific to cloudflare
 */
export declare function getOpenNextConfig(buildOpts: BuildOptions): OpenNextConfig;
/**
 * @returns Unique deployment ID
 */
export declare function getDeploymentId(): string;
export type { OpenNextConfig };
