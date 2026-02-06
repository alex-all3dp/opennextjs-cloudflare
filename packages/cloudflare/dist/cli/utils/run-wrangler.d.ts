import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
export type WranglerTarget = "local" | "remote";
type WranglerOptions = {
    target?: WranglerTarget;
    environment?: string;
    configPath?: string;
    logging?: "all" | "error";
    env?: Record<string, string>;
};
export declare function runWrangler(options: BuildOptions, args: string[], wranglerOpts?: WranglerOptions): void;
export declare function isWranglerTarget(v: string | undefined): v is WranglerTarget;
export {};
