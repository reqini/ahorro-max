import { NavbarVenta } from "@/components/organisms/NavbarVenta"
import { Footer } from "@/components/organisms/Footer"

/** Chrome compartido (header + footer) para las páginas de marketing/SEO — no afecta el home ni /catalogo, que tienen el suyo propio. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarVenta />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
