-- ===========================================================================
-- Kevin Amoroso · CENTURY 21 Domox SA
-- Esquema de Supabase: catálogo de propiedades + métricas del sitio
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO → Run.
-- Se puede volver a ejecutar cuantas veces haga falta: no borra datos.
--
-- Después de correrlo, un único paso a mano:
--   Authentication → Users → Add user → email + contraseña de Kevin.
--   Ese usuario es el que entra a /admin.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1. PROPIEDADES (catálogo)
-- ---------------------------------------------------------------------------
create table if not exists public.propiedades (
  id             text primary key,               -- referencia visible, ej. KA-1001
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  titulo         text    not null,
  tipo           text    not null,               -- casa|duplex|ph|depto|quinta|terreno|local|campo
  zona           text    not null,               -- id de barrio (ver ZONAS en data.js)
  operacion      text    not null default 'venta',
  estado         text    not null default 'disponible',  -- disponible|reservada|vendida

  publicada      boolean not null default true,  -- false = borrador, no sale en el sitio

  precio         numeric not null default 0,
  moneda         text    not null default 'USD',

  dormitorios    int     default 0,
  banos          int     default 0,
  cocheras       int     default 0,
  m2             int     default 0,              -- superficie cubierta
  m2_terreno     int     default 0,
  antiguedad     int     default 0,              -- 0 = a estrenar

  direccion      text,
  destacada      boolean not null default false, -- la muestra en la portada
  nueva          boolean not null default false, -- etiqueta "A estrenar"
  orden          int     default 0,

  resumen        text,
  descripcion    text[]  default '{}',           -- un elemento por párrafo
  amenities      text[]  default '{}',
  servicios      text[]  default '{}',
  imagenes       text[]  default '{}'            -- URLs públicas de Storage
);

-- Por si la tabla ya existía de una versión anterior del esquema
alter table public.propiedades add column if not exists publicada boolean not null default true;
alter table public.propiedades add column if not exists orden int default 0;

create index if not exists propiedades_estado_idx    on public.propiedades (estado);
create index if not exists propiedades_tipo_idx      on public.propiedades (tipo);
create index if not exists propiedades_zona_idx      on public.propiedades (zona);
create index if not exists propiedades_destacada_idx on public.propiedades (destacada);
create index if not exists propiedades_publicada_idx on public.propiedades (publicada);

alter table public.propiedades enable row level security;

-- El sitio público sólo ve las publicaciones marcadas como publicadas.
-- Los borradores quedan visibles únicamente para el panel.
drop policy if exists "cualquiera puede ver propiedades" on public.propiedades;
drop policy if exists "publico ve propiedades publicadas" on public.propiedades;
create policy "publico ve propiedades publicadas"
  on public.propiedades for select
  to anon
  using (publicada = true);

drop policy if exists "panel administra propiedades" on public.propiedades;
create policy "panel administra propiedades"
  on public.propiedades for all
  to authenticated
  using (true) with check (true);

-- Mantiene actualizado_en al día
create or replace function public.tocar_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end $$;

drop trigger if exists propiedades_actualizado_en on public.propiedades;
create trigger propiedades_actualizado_en
  before update on public.propiedades
  for each row execute function public.tocar_actualizado_en();


-- ---------------------------------------------------------------------------
-- 2. EVENTOS (métricas)
-- ---------------------------------------------------------------------------
create table if not exists public.eventos (
  id            bigint generated always as identity primary key,
  creado_en     timestamptz not null default now(),
  tipo          text        not null,   -- visita | ver_propiedad | click_propiedad
                                        -- click_whatsapp | click_telefono | click_email
                                        -- envio_formulario
  pagina        text,
  propiedad_id  text,
  titulo        text,
  referencia    text,                   -- google, instagram, directo, interno…
  visitante_id  uuid        not null,   -- persiste en el navegador del visitante
  sesion_id     uuid        not null,   -- se renueva en cada sesión
  dispositivo   text,                   -- movil | tablet | escritorio
  meta          jsonb
);

create index if not exists eventos_creado_en_idx   on public.eventos (creado_en desc);
create index if not exists eventos_tipo_idx        on public.eventos (tipo);
create index if not exists eventos_propiedad_idx   on public.eventos (propiedad_id);
create index if not exists eventos_visitante_idx   on public.eventos (visitante_id);

alter table public.eventos enable row level security;

-- El sitio público sólo puede INSERTAR. No puede leer, editar ni borrar:
-- así la anon key que viaja en el JavaScript no expone las métricas.
drop policy if exists "sitio puede insertar eventos" on public.eventos;
create policy "sitio puede insertar eventos"
  on public.eventos for insert
  to anon
  with check (true);

-- La lectura queda reservada al panel (usuario autenticado de Supabase Auth).
drop policy if exists "panel puede leer eventos" on public.eventos;
create policy "panel puede leer eventos"
  on public.eventos for select
  to authenticated
  using (true);


-- ---------------------------------------------------------------------------
-- 3. VISTAS DE APOYO (opcionales, para mirar desde el SQL Editor)
--    security_invoker: la vista respeta el RLS de quien consulta, así que
--    no filtra las métricas a la anon key.
-- ---------------------------------------------------------------------------
drop view if exists public.metricas_por_dia;
create view public.metricas_por_dia with (security_invoker = true) as
select
  date_trunc('day', creado_en)::date                  as dia,
  count(*) filter (where tipo = 'visita')             as visitas,
  count(distinct visitante_id)                        as visitantes,
  count(*) filter (where tipo = 'ver_propiedad')      as vistas_propiedad,
  count(*) filter (where tipo = 'click_whatsapp')     as clics_whatsapp,
  count(*) filter (where tipo = 'envio_formulario')   as consultas
from public.eventos
where creado_en > now() - interval '90 days'
group by 1
order by 1 desc;

drop view if exists public.metricas_propiedades;
create view public.metricas_propiedades with (security_invoker = true) as
select
  e.propiedad_id,
  coalesce(max(p.titulo), max(e.titulo))            as titulo,
  count(*) filter (where e.tipo = 'ver_propiedad')  as vistas,
  count(*) filter (where e.tipo = 'click_whatsapp') as clics_whatsapp,
  count(distinct e.visitante_id)                    as visitantes_unicos
from public.eventos e
left join public.propiedades p on p.id = e.propiedad_id
where e.propiedad_id is not null
group by e.propiedad_id
order by vistas desc;


-- ---------------------------------------------------------------------------
-- 4. STORAGE — bucket público `propiedades` para las fotos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'propiedades', 'propiedades', true, 10485760,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
  set public             = true,
      file_size_limit    = 10485760,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

-- Cualquiera puede ver las fotos (el bucket es público).
drop policy if exists "fotos visibles para todos" on storage.objects;
create policy "fotos visibles para todos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'propiedades');

-- Sólo el panel (usuario autenticado) sube, reemplaza y borra fotos.
drop policy if exists "panel sube fotos" on storage.objects;
create policy "panel sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'propiedades');

drop policy if exists "panel actualiza fotos" on storage.objects;
create policy "panel actualiza fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'propiedades') with check (bucket_id = 'propiedades');

drop policy if exists "panel borra fotos" on storage.objects;
create policy "panel borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'propiedades');


-- ---------------------------------------------------------------------------
-- 5. LISTO
--    Falta un solo paso a mano:
--    Authentication → Users → Add user → email + contraseña.
--    Con ese email y esa contraseña se entra a https://kevinamoroso.vercel.app/admin
-- ---------------------------------------------------------------------------
