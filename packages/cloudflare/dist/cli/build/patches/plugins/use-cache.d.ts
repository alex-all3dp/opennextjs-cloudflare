import type { CodePatcher } from "@opennextjs/aws/build/patch/codePatcher.js";
export declare const rule = "\nrule:\n  kind: if_statement\n  inside:\n    kind: function_declaration\n    stopBy: end\n    has:\n      kind: identifier\n      pattern: createSnapshot\nfix:\n  '// Ignored snapshot'\n";
export declare const patchUseCacheIO: CodePatcher;
