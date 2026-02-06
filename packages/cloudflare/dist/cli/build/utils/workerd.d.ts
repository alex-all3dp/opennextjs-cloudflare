import type { BuildOptions } from "@opennextjs/aws/build/helper.js";
/**
 * This function transforms the exports (or imports) object from the package.json
 * to only include the build condition if found (e.g. "workerd") and remove everything else.
 * If no build condition is found, it keeps everything as is.
 * It also returns a boolean indicating if the build condition was found.
 * @param conditionMap The exports (or imports) object from the package.json
 * @param condition The build condition to look for
 * @returns An object with the transformed exports and a boolean indicating if the build condition was found
 */
export declare function transformBuildCondition(conditionMap: {
    [key: string]: unknown;
}, condition: string): {
    transformedExports: {
        [key: string]: unknown;
    };
    hasBuildCondition: boolean;
};
interface PackageJson {
    name: string;
    exports?: {
        [key: string]: unknown;
    };
    imports?: {
        [key: string]: unknown;
    };
}
/**
 *
 * @param json The package.json object
 * @returns An object with the transformed package.json and a boolean indicating if the build condition was found
 */
export declare function transformPackageJson(json: PackageJson): {
    transformed: PackageJson;
    hasBuildCondition: boolean;
};
export declare function copyWorkerdPackages(options: BuildOptions, nodePackages: Map<string, string>): Promise<void>;
export {};
