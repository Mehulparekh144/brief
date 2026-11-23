import type { NextConfig } from "next";

const config: NextConfig = {
  // e2b uses Node APIs; load it from node_modules at runtime instead of bundling it.
  serverExternalPackages: ["e2b"],
};

export default config;
