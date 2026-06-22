/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",       // genera carpeta /out con HTML estático
  trailingSlash: true,    // GitHub Pages requiere index.html en cada ruta
  images: {
    unoptimized: true,    // next/image sin servidor de optimización
  },
  // Si el sitio vive en https://usuario.github.io/REPO_NAME/ descomentá:
  // basePath: "/ahorra-max",
  // assetPrefix: "/ahorro-max/",
}

export default nextConfig
