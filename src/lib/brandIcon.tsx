/**
 * Ícono de marca compartido entre favicon/apple-icon/manifest — mismo negro +
 * borde rojo + "M" amarilla que ya usan public/logo.svg y el resto del sitio.
 * No usa el wordmark completo (logo.png) porque a 16-32px se vuelve ilegible.
 */
export function BrandIcon({ size }: { size: number }) {
  const border = Math.max(2, Math.round(size * 0.07))
  const fontSize = Math.round(size * 0.6)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        border: `${border}px solid #CC0000`,
      }}
    >
      <div
        style={{
          display: 'flex',
          color: '#F5C000',
          fontSize,
          fontWeight: 900,
          letterSpacing: -Math.round(size * 0.02),
        }}
      >
        M
      </div>
    </div>
  )
}
