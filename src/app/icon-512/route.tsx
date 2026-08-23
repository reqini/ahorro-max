import { ImageResponse } from 'next/og'

/** Ícono cuadrado 512x512 para el manifest.json (PWA). */
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
          fontSize: 260,
          fontWeight: 900,
        }}
      >
        AM
      </div>
    ),
    { width: 512, height: 512 }
  )
}
