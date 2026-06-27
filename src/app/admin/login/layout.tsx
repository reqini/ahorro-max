// Layout propio para login — evita que el AdminLayout (barra de navegación)
// envuelva la página de login y cause redirect loops.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
