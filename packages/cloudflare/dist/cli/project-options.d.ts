import type { WranglerTarget } from "./utils/run-wrangler.js";
export type ProjectOptions = {
    sourceDir: string;
    skipNextBuild: boolean;
    skipWranglerConfigCheck: boolean;
    minify: boolean;
    populateCache?: {
        mode: WranglerTarget;
        onlyPopulateWithoutBuilding: boolean;
    };
};
