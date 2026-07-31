import type { NextConfig } from "next";

const isPagesBuild = process.env.PAGES_BUILD === "true";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/").at(-1) ??
  "Black-Candle-Lab-One";
const pagesBasePath = isPagesBuild ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isPagesBuild
    ? {
        output: "export",
        trailingSlash: true,
        basePath: pagesBasePath,
        assetPrefix: pagesBasePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
