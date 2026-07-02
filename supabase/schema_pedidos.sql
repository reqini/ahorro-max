-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero bigserial,
  vendedor text NOT NULL,
  cliente_nombre text NOT NULL DEFAULT '',
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  items jsonb NOT NULL DEFAULT '[]',
  tipo_precio text NOT NULL DEFAULT 'minorista' CHECK (tipo_precio IN ('minorista', 'mayorista')),
  total_estimado text,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  notas text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS pedidos_vendedor_idx ON pedidos(vendedor);
CREATE INDEX IF NOT EXISTS pedidos_estado_idx ON pedidos(estado);
CREATE INDEX IF NOT EXISTS pedidos_created_at_idx ON pedidos(created_at DESC);

-- RLS desactivado (usamos service role key desde server)
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
