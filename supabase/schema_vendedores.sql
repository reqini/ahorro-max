-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS vendedores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  nombre text NOT NULL,
  password_hash text NOT NULL,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendedores_username ON vendedores(username);
