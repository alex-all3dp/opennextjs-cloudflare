/**
 * ESBuild plugin to handle optional dependencies.
 *
 * Optional dependencies might be installed by the application to support optional features.
 *
 * When an optional dependency is installed, it must be inlined in the bundle.
 * When it is not installed, the plugin swaps it for a throwing implementation.
 *
 * The plugin uses ESBuild built-in resolution to check if the dependency is installed.
 */
import type { PluginBuild } from "esbuild";
export declare function handleOptionalDependencies(dependencies: string[]): {
    name: string;
    setup: (build: PluginBuild) => Promise<void>;
};
