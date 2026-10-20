/** @type {import('next').NextConfig} */
const nextConfig = {
    // This app lives in a subfolder of the old Laravel project; don't treat the parent as the workspace.
    turbopack: { root: import.meta.dirname },
    outputFileTracingRoot: import.meta.dirname,
    // The Access bridge (db/bridge.js) is executed by cscript at runtime, not bundled.
    outputFileTracingIncludes: {
        '/**': ['./db/bridge.js'],
    },
};

export default nextConfig;
