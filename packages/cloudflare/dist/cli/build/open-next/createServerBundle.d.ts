import * as buildHelper from "@opennextjs/aws/build/helper.js";
import type { CodePatcher } from "@opennextjs/aws/build/patch/codePatcher.js";
import type { ContentUpdater } from "@opennextjs/aws/plugins/content-updater.js";
import type { Plugin } from "esbuild";
interface CodeCustomization {
    additionalCodePatches?: CodePatcher[];
    additionalPlugins?: (contentUpdater: ContentUpdater) => Plugin[];
}
export declare function createServerBundle(options: buildHelper.BuildOptions, codeCustomization?: CodeCustomization): Promise<void>;
export {};
