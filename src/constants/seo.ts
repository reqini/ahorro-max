/**
 * Dominio real en producción. El sitio venía declarando `www.ahorramax.com.ar`
 * como canonical en metadata/sitemap/JSON-LD, pero ese dominio no resuelve —
 * nunca se compró/configuró. `ahorramax.app` es el dominio real (Vercel).
 */
export const BASE_URL = "https://ahorramax.app"

export const BUSINESS_NAME = "Distribuidora Ahorra Max"

/** Para el sufijo del template de <title>: con el nombre completo casi no queda presupuesto de caracteres. */
export const BUSINESS_NAME_SHORT = "Ahorra Max"
