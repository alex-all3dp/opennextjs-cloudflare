import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
/**
 * Copies
 * - the template files present in the cloudflare adapter package to `.open-next/cloudflare-templates`
 * - `worker.js` to `.open-next/`
 */
export declare function copyPackageCliFiles(packageDistDir: string, buildOpts: BuildOptions): void;
