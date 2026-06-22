import { MetadataRoute } from "next"

const BASE_URL = "https://www.ahorramax.com.ar"

// Important for static export (output: "export")
export const dynamic = "force-static"
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}

