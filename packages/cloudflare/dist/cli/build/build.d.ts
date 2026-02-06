import * as buildHelper from "@opennextjs/aws/build/helper.js";
import type { Unstable_Config } from "wrangler";
import { OpenNextConfig } from "../../api/config.js";
import type { ProjectOptions } from "../project-options.js";
/**
 * Builds the application in a format that can be passed to workerd
 *
 * It saves the output in a `.worker-next` directory
 *
 * @param options The OpenNext options
 * @param config The OpenNext config
 * @param projectOpts The options for the project
 */
export declare function build(options: buildHelper.BuildOptions, config: OpenNextConfig, projectOpts: ProjectOptions, wranglerConfig: Unstable_Config, allowUnsupportedNextVersions: boolean): Promise<void>;
