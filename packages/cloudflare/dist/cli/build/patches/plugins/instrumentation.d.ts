import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
export declare function patchInstrumentation(updater: ContentUpdater, buildOpts: BuildOptions): Plugin;
export declare function getNext154Rule(builtInstrumentationPath: string | null): string;
export declare function getNext15Rule(builtInstrumentationPath: string | null): string;
export declare function getNext14Rule(builtInstrumentationPath: string | null): string;
