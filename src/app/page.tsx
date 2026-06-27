import { LandingTemplate } from "@/components/templates"

// Revalidate every 60s so promo changes reflect quickly.
// Admin saves also call revalidatePath('/') for immediate refresh.
export const revalidate = 60

export default function Home() {
  return <LandingTemplate />
}
