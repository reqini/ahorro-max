import { MetadataRoute } from "next"
import { BUSINESS_NAME, BUSINESS_NAME_SHORT } from "@/constants"

export const dynamic = "force-static"
export const revalidate = false

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS_NAME,
    short_name: BUSINESS_NAME_SHORT,
    description: "Mayorista de bebidas en Ciudadela, zona oeste del Gran Buenos Aires.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#CC0000",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  }
}
