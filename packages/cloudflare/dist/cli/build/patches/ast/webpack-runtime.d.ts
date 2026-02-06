/**
 * Inline dynamic requires in the webpack runtime.
 *
 * The webpack runtime has dynamic requires that would not be bundled by ESBuild:
 *
 *     installChunk(require("./chunks/" + __webpack_require__.u(chunkId)));
 *
 *  This patch unrolls the dynamic require for all the existing chunks:
 *
 *  For multiple chunks:
 *     switch (chunkId) {
 *       case ID1: installChunk(require("./chunks/ID1"); break;
 *       case ID2: installChunk(require("./chunks/ID2"); break;
 *       // ...
 *       case SELF_ID: installedChunks[chunkId] = 1; break;
 *       default: throw new Error(`Unknown chunk ${chunkId}`);
 *     }
 *
 * For a single chunk:
 *     require("./chunks/CHUNK_ID.js");
 */
import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
export declare function buildMultipleChunksRule(chunks: number[]): string;
export declare const singleChunkRule = "\nrule:\n  pattern: ($CHUNK_ID, $_PROMISES) => { $$$ }\n  inside: {pattern: $_.$_.require = $$$_, stopBy: end}\n  all:\n    - has: {pattern: $INSTALL(require(\"./chunks/\" + $$$)), stopBy: end}\n    - has: {pattern: $SELF_ID == $CHUNK_ID, stopBy: end}\n    - has: {pattern: \"$INSTALLED_CHUNK[$CHUNK_ID] = 1\", stopBy: end}\nfix: |\n  ($CHUNK_ID, _) => {\n    if (!$INSTALLED_CHUNK[$CHUNK_ID]) {\n      try {\n        $INSTALL(require(\"./chunks/$SELF_ID.js\"));\n      } catch {}\n    }\n  }\n";
/**
 * Fixes the webpack-runtime.js and webpack-api-runtime.js files by inlining
 * the webpack dynamic requires.
 */
export declare function patchWebpackRuntime(buildOpts: BuildOptions): Promise<void>;
