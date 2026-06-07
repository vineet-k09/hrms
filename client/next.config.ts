import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname
  },
  reactCompiler: true,
  allowedDevOrigins: ['3000-cs-c1ec6393-fb84-4f95-ad8f-4cc6cad616cb.cs-asia-southeast1-fork.cloudshell.dev'],
};

export default nextConfig;
