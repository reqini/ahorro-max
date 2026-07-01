-- Migración v2: campos extendidos del formulario papel
-- Ejecutar en Supabase SQL Editor

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tipo_negocio text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS contacto    text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS horarios    text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS dia_visita  text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS metodo_contacto text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS vendedor    text DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS zona_ruta   text DEFAULT '';
