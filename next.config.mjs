import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Sin esto, Turbopack detecta un package-lock.json huérfano en ~/ (fuera de este
  // repo) y lo toma como raíz del workspace, intentando escanear todo el Desktop.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
