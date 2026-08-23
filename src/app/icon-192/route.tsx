import { ImageResponse } from 'next/og'
import { BrandIcon } from '@/lib/brandIcon'

/** Ícono cuadrado 192x192 para el manifest.json (PWA). */
export async function GET() {
  return new ImageResponse(<BrandIcon size={192} />, { width: 192, height: 192 })
}
