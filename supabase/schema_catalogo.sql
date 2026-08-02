-- Ejecutar en Supabase SQL Editor
-- Catálogo con foto y comparación de precios contra cadenas.

-- Imagen oficial de marca del producto (URL). Si está vacío, el catálogo muestra
-- un placeholder con la inicial y un color por categoría.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen_url text NOT NULL DEFAULT '';

-- Marca del producto (Coca-Cola, Marolio…), para agrupar y mostrar.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca text NOT NULL DEFAULT '';

-- Comparaciones de precio contra otras cadenas, cargadas a mano por el admin.
-- Cada elemento: { "cadena": "Coto", "precio": "1200", "url": "https://...", "fecha": "2026-08-02" }
-- El precio es de referencia y lleva fecha; la url linkea al ecommerce de la
-- cadena para que el cliente verifique en la fuente. No se scrapea nada.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS comparaciones jsonb NOT NULL DEFAULT '[]'::jsonb;
