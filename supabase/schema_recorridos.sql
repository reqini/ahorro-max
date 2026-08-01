-- Ejecutar en Supabase SQL Editor
-- Sistema de recorridos a pie para vendedores.

-- Padrón de direcciones importado desde Excel (admin). Una fila por dirección.
CREATE TABLE IF NOT EXISTS direcciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  direccion  text NOT NULL,               -- texto original del Excel, para mostrar
  calle      text NOT NULL DEFAULT '',    -- calle normalizada, para ordenar y geocodificar
  altura     integer,                     -- número de puerta (null si no se pudo detectar)
  barrio     text NOT NULL DEFAULT '',
  localidad  text NOT NULL DEFAULT '',
  partido    text NOT NULL DEFAULT '',
  zona       text NOT NULL DEFAULT '',    -- barrio || localidad: es lo que elige el vendedor
  lat        double precision,
  lng        double precision,
  geo_estado text NOT NULL DEFAULT 'pendiente', -- 'pendiente' | 'ok' | 'fallo'
  geo_query  text NOT NULL DEFAULT '',    -- consulta enviada al geocoder (para depurar fallos)
  clave      text NOT NULL,               -- dedupe: "calle altura|zona" (o el texto original si no hay altura)
  created_at timestamptz DEFAULT now()
);

-- Reimportar el mismo Excel no debe duplicar direcciones ni perder las coordenadas ya resueltas.
CREATE UNIQUE INDEX IF NOT EXISTS idx_direcciones_clave ON direcciones(clave);
CREATE INDEX IF NOT EXISTS idx_direcciones_zona ON direcciones(zona);
CREATE INDEX IF NOT EXISTS idx_direcciones_partido ON direcciones(partido);
CREATE INDEX IF NOT EXISTS idx_direcciones_geo_estado ON direcciones(geo_estado);

-- Un recorrido armado por un vendedor a partir de una o más zonas.
CREATE TABLE IF NOT EXISTS recorridos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      text NOT NULL DEFAULT '',
  vendedor    text NOT NULL DEFAULT '',   -- username del vendedor
  zonas       jsonb NOT NULL DEFAULT '[]'::jsonb,
  estado      text NOT NULL DEFAULT 'activo', -- 'activo' | 'completado'
  distancia_m integer NOT NULL DEFAULT 0,  -- largo estimado a pie, en metros
  minutos     integer NOT NULL DEFAULT 0,  -- duración estimada (caminata + tiempo por parada)
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Agenda: el admin arma los recorridos de la semana y se los asigna a cada vendedor
-- para un día concreto. Si no hay fecha, vale el día en que se creó.
ALTER TABLE recorridos ADD COLUMN IF NOT EXISTS fecha date;
ALTER TABLE recorridos ADD COLUMN IF NOT EXISTS asignado_por text NOT NULL DEFAULT '';
UPDATE recorridos SET fecha = created_at::date WHERE fecha IS NULL;

CREATE INDEX IF NOT EXISTS idx_recorridos_vendedor ON recorridos(vendedor);
CREATE INDEX IF NOT EXISTS idx_recorridos_estado ON recorridos(estado);
CREATE INDEX IF NOT EXISTS idx_recorridos_fecha ON recorridos(vendedor, fecha);

-- Paradas del recorrido, ya ordenadas. Guardan copia de la dirección para que el
-- recorrido siga siendo legible aunque después se borre o reimporte el padrón.
CREATE TABLE IF NOT EXISTS recorrido_paradas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recorrido_id uuid NOT NULL REFERENCES recorridos(id) ON DELETE CASCADE,
  direccion_id uuid REFERENCES direcciones(id) ON DELETE SET NULL,
  orden        integer NOT NULL DEFAULT 0,
  direccion    text NOT NULL DEFAULT '',
  zona         text NOT NULL DEFAULT '',
  lat          double precision,
  lng          double precision,
  metros_desde_anterior integer NOT NULL DEFAULT 0,
  estado       text NOT NULL DEFAULT 'pendiente', -- 'pendiente' | 'visitada' | 'no_atendio' | 'cerrado'
  nota         text NOT NULL DEFAULT '',
  visitada_at  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_paradas_recorrido ON recorrido_paradas(recorrido_id, orden);
