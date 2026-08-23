export interface BlogPost {
  slug: string
  title: string
  description: string
  /** ISO 8601 (YYYY-MM-DD). */
  publishedAt: string
  updatedAt?: string
  author: string
}

/** Vacío hasta que se escriban los primeros posts — /blog se aborda en otra etapa. */
export const BLOG_POSTS: BlogPost[] = []
