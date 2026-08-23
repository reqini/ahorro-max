import { ImageResponse } from 'next/og'

/** Ícono cuadrado 192x192 para el manifest.json (PWA) — no hay ningún asset cuadrado en el repo (logo.png es 1536x1024). */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#CC0000',
          color: '#fff',
          fontSize: 100,
          fontWeight: 900,
        }}
      >
        AM
      </div>
    ),
    { width: 192, height: 192 }
  )
}
