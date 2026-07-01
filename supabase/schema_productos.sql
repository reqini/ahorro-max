-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS productos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  precio_minorista text DEFAULT '',
  precio_mayorista text DEFAULT '',
  categoria text DEFAULT '',
  descripcion text DEFAULT '',
  activo boolean DEFAULT true,
  orden int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
