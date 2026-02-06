import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
export async function compileSkewProtection(options, config) {
    const currentDir = path.join(path.dirname(fileURLToPath(import.meta.url)));
    const templatesDir = path.join(currentDir, "../../templates");
    const initPath = path.join(templatesDir, "skew-protection.js");
    const skewProtectionEnabled = config.cloudflare?.skewProtection?.enabled === true;
    await build({
        entryPoints: [initPath],
        outdir: path.join(options.outputDir, "cloudflare"),
        bundle: false,
        minify: false,
        format: "esm",
        target: "esnext",
        platform: "node",
        define: {
            __SKEW_PROTECTION_ENABLED__: JSON.stringify(skewProtectionEnabled),
        },
    });
}
