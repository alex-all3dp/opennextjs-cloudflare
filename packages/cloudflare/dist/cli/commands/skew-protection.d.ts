/**
 * We need to maintain a mapping of deployment id to worker version for skew protection.
 *
 * The mapping is used to request the correct version of the workers when Next attaches a deployment id to a request.
 *
 * The mapping is stored in a worker en var:
 *
 *   {
 *      latestDepId: "current",
 *      depIdx: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *      depIdy: "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
 *      depIdz: "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
 *   }
 *
 * Note that the latest version is not known at build time as the version id only gets created on deployment.
 * This is why we use the "current" placeholder.
 *
 * When a new version is deployed:
 * - "current" is replaced with the latest version of the Worker
 * - a new entry is added for the new deployment id with the "current" version
 */
import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import { Cloudflare } from "cloudflare";
import type { OpenNextConfig } from "../../api/index.js";
import type { WorkerEnvVar } from "./helpers.js";
/**
 * Compute the deployment mapping for a deployment.
 *
 * @param buildOpts Build options
 * @param config OpenNext config
 * @param workerEnvVars Worker Environment variables (taken from the wrangler config files)
 * @returns Deployment mapping or undefined
 */
export declare function getDeploymentMapping(buildOpts: BuildOptions, config: OpenNextConfig, workerEnvVars: WorkerEnvVar): Promise<Record<string, string> | undefined>;
/**
 * Update an existing deployment mapping:
 * - Replace the "current" version with the latest deployed version
 * - Add a "current" version for the current deployment ID
 * - Remove versions that are not passed in
 *
 * @param mapping Existing mapping
 * @param versions Versions ordered by descending time
 * @param deploymentId Deployment ID
 * @returns The updated mapping
 */
export declare function updateDeploymentMapping(mapping: Record<string, string>, versions: {
    id: string;
}[], deploymentId: string): Record<string, string>;
/**
 * Retrieve the versions for the script
 *
 * @param scriptName The name of the worker script
 * @param options.client A Cloudflare API client
 * @param options.accountId The Cloudflare account id
 * @param options.afterTimeMs Only list version more recent than this time - default to 7 days
 * @param options.maxNumberOfVersions The maximum number of version to return - default to 20 versions.
 * @returns A list of id and creation date ordered by descending creation date
 */
export declare function listWorkerVersions(scriptName: string, options: {
    client: Cloudflare;
    accountId: string;
    afterTimeMs?: number;
    maxNumberOfVersions?: number;
}): Promise<{
    id: string;
    createdOnMs: number;
}[]>;
