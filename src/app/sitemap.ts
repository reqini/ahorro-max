import { MetadataRoute } from "next"
import { BASE_URL } from "@/constants"
import { getMayoristaVerticals } from "@/constants/mayoristaVerticals"

export const dynamic = "force-static"
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...getMayoristaVerticals().map((v) => ({
      url: `${BASE_URL}/${v.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
