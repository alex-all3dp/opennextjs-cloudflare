/**
 * Misc patches for `next-server.js`
 *
 * Note: we will probably need to revisit the patches when the Next adapter API lands
 *
 * - Inline `getBuildId` as it relies on `readFileSync` that is not supported by workerd
 * - Override the cache and composable cache handlers
 */
import { type BuildOptions } from "@opennextjs/aws/build/helper.js";
import type { ContentUpdater, Plugin } from "@opennextjs/aws/plugins/content-updater.js";
export declare function patchNextServer(updater: ContentUpdater, buildOpts: BuildOptions): Plugin;
export declare const disableNodeMiddlewareRule = "\nrule:\n  pattern:\n    selector: method_definition\n    context: \"class { async loadNodeMiddleware($$$PARAMS) { $$$_ } }\"\nfix: |-\n  async loadNodeMiddleware($$$PARAMS) {\n    // patched by open next\n  }\n";
export declare const buildIdRule = "\nrule:\n  pattern:\n    selector: method_definition\n    context: \"class { getBuildId($$$PARAMS) { $$$_ } }\"\nfix: |-\n  getBuildId($$$PARAMS) {\n    return process.env.NEXT_BUILD_ID;\n  }\n";
/**
 * The cache handler used by Next.js is normally defined in the config file as a path. At runtime,
 * Next.js would then do a dynamic require on a transformed version of the path to retrieve the
 * cache handler and create a new instance of it.
 *
 * This is problematic in workerd due to the dynamic import of the file that is not known from
 * build-time. Therefore, we have to manually override the default way that the cache handler is
 * instantiated with a dynamic require that uses a string literal for the path.
 */
export declare function createCacheHandlerRule(handlerPath: string): string;
export declare function createComposableCacheHandlersRule(handlerPath: string): string;
/**
 * `attachRequestMeta` sets `initUrl` to always be with `https` cause this.fetchHostname && this.port is undefined in our case.
 * this.nextConfig.experimental.trustHostHeader is also true.
 *
 * This patch checks if the original protocol was "http:" and rewrites the `initUrl` to reflect the actual host protocol.
 * It will make `request.url` in route handlers end up with the correct protocol.
 *
 * Note: We cannot use the already defined `initURL` we passed in as requestMetaData to NextServer's request handler as pages router
 * data routes would fail. It would miss the `_next/data` part in the path in that case.
 *
 * Therefor we just replace the protocol if necessary in the value from this template string:
 * https://github.com/vercel/next.js/blob/ea08bf27/packages/next/src/server/next-server.ts#L1920
 *
 * Affected lines:
 * https://github.com/vercel/next.js/blob/ea08bf27/packages/next/src/server/next-server.ts#L1916-L1923
 *
 * Callstack: handleRequest-> handleRequestImpl -> attachRequestMeta
 *
 */
export declare const attachRequestMetaRule = "\nrule:\n  kind: identifier\n  regex: ^initUrl$\n  inside:\n    kind: arguments\n    all:\n      - has: {kind: identifier, regex: ^req$}\n      - has: {kind: string, regex: initURL}\n    inside:\n      kind: call_expression\n      all:\n        - has: {kind: parenthesized_expression, regex: '0'}\n        - has: { regex: _requestmeta.addRequestMeta}\n      inside:\n        kind: expression_statement\n        inside:\n          kind: statement_block\n          inside:\n            kind: method_definition\n            has:\n              kind: property_identifier\n              regex: ^attachRequestMeta$\nfix:\n  'req[Symbol.for(\"NextInternalRequestMeta\")]?.initProtocol === \"http:\" && initUrl.startsWith(\"https://\") ? `http://${initUrl.slice(8)}`: initUrl'";
