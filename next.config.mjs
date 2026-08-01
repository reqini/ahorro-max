import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // El padrón de direcciones se sube por un server action y el límite por defecto
    // es 1 MB: un Excel de varios miles de filas lo pasa sin problema.
    serverActions: { bodySizeLimit: '10mb' },
  },
  // Sin esto, Turbopack detecta un package-lock.json huérfano en ~/ (fuera de este
  // repo) y lo toma como raíz del workspace, intentando escanear todo el Desktop.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
