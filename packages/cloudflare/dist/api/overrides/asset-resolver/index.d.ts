import type { AssetResolver } from "@opennextjs/aws/types/overrides.js";
/**
 * Serves assets when `run_worker_first` is set to true.
 *
 * When `run_worker_first` is `false`, the assets are served directly bypassing Next routing.
 *
 * When it is `true`, assets are served from the routing layer. It should be used when assets
 * should be behind the middleware or when skew protection is enabled.
 *
 * See https://developers.cloudflare.com/workers/static-assets/binding/#run_worker_first
 */
declare const resolver: AssetResolver;
/**
 * @param runWorkerFirst `run_worker_first` config
 * @param pathname pathname of the request
 * @returns Whether the user worker runs first
 */
export declare function isUserWorkerFirst(runWorkerFirst: boolean | string[] | undefined, pathname: string): boolean;
export default resolver;
