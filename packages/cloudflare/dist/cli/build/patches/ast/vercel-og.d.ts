import { SgNode } from "@opennextjs/aws/build/patch/astCodePatcher.js";
export declare const vercelOgImportRule = "\nrule:\n  pattern: $NODE\n  kind: string\n  regex: \"next/dist/compiled/@vercel/og/index\\\\.node\\\\.js\"\ninside:\n  kind: arguments\n  inside:\n    kind: call_expression\n    stopBy: end\n    has:\n      field: function\n      regex: \"import\"\n\nfix: |-\n  \"next/dist/compiled/@vercel/og/index.edge.js\"\n";
/**
 * Patches Node.js imports for the library to be Edge imports.
 *
 * @param root Root node.
 * @returns Results of applying the rule.
 */
export declare function patchVercelOgImport(root: SgNode): {
    edits: import("@ast-grep/napi/types/sgnode").Edit[];
    matches: SgNode[];
};
export declare const vercelOgFallbackFontRule = "\nrule:\n  kind: variable_declaration\n  all:\n    - has:\n        kind: variable_declarator\n        has:\n          kind: identifier\n          regex: ^fallbackFont$\n    - has:\n        kind: call_expression\n        pattern: fetch(new URL(\"$PATH\", $$$REST))\n        stopBy: end\n\nfix: |-\n  async function getFallbackFont() {\n    // .bin is used so that a loader does not need to be configured for .ttf files\n    return (await import(\"$PATH.bin\")).default;\n  }\n\n  var fallbackFont = getFallbackFont();\n";
/**
 * Patches the default font fetching to use a .bin import.
 *
 * We use `.bin` extension as they are added as modules in the wrangler bundler.
 * We would need to add a rule to handle `.ttf` otherwise.
 *
 * @param root Root node.
 * @returns Results of applying the rule.
 */
export declare function patchVercelOgFallbackFont(root: SgNode): {
    edits: import("@ast-grep/napi/types/sgnode").Edit[];
    matches: SgNode[];
};
