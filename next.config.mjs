import path from "node:path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["streamdown"],
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      streamdown: path.resolve(process.cwd(), "node_modules/streamdown/dist/index.js"),
    }
    return config
  },
}

export default nextConfig