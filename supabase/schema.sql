-- ============================================================
-- Ahorra Max — Supabase schema
-- ============================================================
-- Variables de entorno necesarias en .env.local:
--   NEXT_PUBLIC_SUPABASE_URL=
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=
--   SUPABASE_SERVICE_ROLE_KEY=
--   ADMIN_PASSWORD=
--   ADMIN_SECRET=
--
-- Bucket de Storage: crear un bucket público llamado "listas-precios"
--   En el dashboard de Supabase:
--   Storage → New bucket → nombre: listas-precios → Public: ON
-- ============================================================

-- Config: valores clave como teléfono, mensajes WhatsApp
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO config (key, value) VALUES
  ('telefono', '11 5020-3114'),
  ('whatsapp_number', '5491150203114'),
  ('whatsapp_msg_minorista', 'Hola! Vi su página y quiero consultar como minorista 🛒'),
  ('whatsapp_msg_mayorista', 'Hola! Vi su página y quiero consultar precios mayoristas 📦'),
  ('lista_minorista_url', ''),
  ('lista_mayorista_url', '')
ON CONFLICT (key) DO NOTHING;

-- Sucursales
CREATE TABLE IF NOT EXISTS sucursales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  horarios TEXT DEFAULT '',
  maps_url TEXT DEFAULT '',
  activa BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ofertas
CREATE TABLE IF NOT EXISTS ofertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('minorista', 'mayorista')),
  nombre TEXT NOT NULL,
  detalle TEXT DEFAULT '',
  precio TEXT DEFAULT 'Consultá',
  activa BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
