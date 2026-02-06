// Copied from https://github.com/vercel/next.js/blob/4518bc91641a0fd938664b781e12ae7c145f3396/packages/next/src/lib/needs-experimental-react.ts#L3-L6
export function needsExperimentalReact(nextConfig) {
    const { ppr, taint, viewTransition } = nextConfig.experimental || {};
    return Boolean(ppr || taint || viewTransition);
}
