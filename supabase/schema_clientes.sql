-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS clientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  telefono text DEFAULT '',
  direccion text DEFAULT '',
  tipo text NOT NULL DEFAULT 'potencial', -- 'minorista' | 'mayorista' | 'potencial'
  estado text NOT NULL DEFAULT 'activo',  -- 'activo' | 'inactivo'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notas_cliente (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  texto text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_notas_cliente_id ON notas_cliente(cliente_id);
