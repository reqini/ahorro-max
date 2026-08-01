-- Ejecutar en Supabase SQL Editor
-- Comprobante del pedido: copia al cliente por WhatsApp o, si no tiene, firma
-- digital en el celular del vendedor para dejar asentado el pedido y el precio.

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_telefono text NOT NULL DEFAULT '';

-- La firma se guarda como data URL PNG (unos pocos KB): evita tener que crear y
-- administrar un bucket de storage solo para esto.
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS firma text NOT NULL DEFAULT '';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS firma_aclaracion text NOT NULL DEFAULT '';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS firmado_at timestamptz;

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS comprobante_enviado_at timestamptz;
