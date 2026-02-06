import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
/**
 * Some dependencies of Next.js use depd to deprecate some of their functions, depd uses `eval` to generate
 * a deprecated version of such functions, this causes `eval` warnings in the terminal even if these functions
 * are never called, this function fixes that by patching the depd `wrapfunction` function so that it still
 * retains the same type of behavior but without using `eval`
 */
export declare function patchDepdDeprecations(updater: ContentUpdater): Plugin;
export declare const rule = "\nrule:\n  kind: function_declaration\n  pattern: function wrapfunction($FN, $MESSAGE) { $$$ }\n  all:\n    - has:\n        kind: variable_declarator\n        stopBy: end\n        has:\n          field: name\n          pattern: deprecatedfn\n    - has:\n        kind: call_expression\n        stopBy: end\n        has:\n          kind: identifier\n          pattern: eval\nfix:\n  function wrapfunction($FN, $MESSAGE) {\n    if(typeof $FN !== 'function') throw new Error(\"argument fn must be a function\");\n    return function deprecated_$FN(...args) {\n      console.warn($MESSAGE);\n      return $FN(...args);\n    }\n  }\n";
