/**
 * Compute the diff resulting of applying the `rule` to `src`.
 *
 * @param filename Filename used in the patch output
 * @param src Content of the source code
 * @param rule ASTgrep rule
 * @returns diff in unified diff format
 */
export declare function computePatchDiff(filename: string, src: string, rule: string): string;
