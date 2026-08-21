-- Ejecutar en Supabase SQL Editor
-- La lista de precios se vende por pack cerrado y por unidad suelta: hacen falta
-- dos datos más por producto para poder mostrar los dos precios sin inventarlos.

-- Cómo viene el artículo: "Pack x24 · 473ml · lata". Sale del Excel (columna
-- Presentacion) y es lo primero que pregunta el cliente después del precio.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS presentacion text NOT NULL DEFAULT '';

-- Precio del pack cerrado completo. `precio_minorista` es el de la unidad suelta
-- y `precio_mayorista` el de la unidad llevando el pack; este es el total del pack.
ALTER TABLE productos ADD COLUMN IF NOT EXISTS precio_pack text NOT NULL DEFAULT '';

-- Bucket público para las fotos reales de producto, que es lo que sube
-- /admin/productos. Tiene que ser público: la foto se muestra en el catálogo
-- abierto, sin sesión.
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO UPDATE SET public = true;
