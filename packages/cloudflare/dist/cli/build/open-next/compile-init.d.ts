import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { Unstable_Config } from "wrangler";
/**
 * Compiles the initialization code for the workerd runtime
 */
export declare function compileInit(options: BuildOptions, wranglerConfig: Unstable_Config): Promise<void>;
