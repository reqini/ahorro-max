/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/ahorra-max",
  assetPrefix: "/ahorra-max/",
}

export default nextConfig
