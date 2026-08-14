-- ===========================================================================
-- Kevin Amoroso · CENTURY 21 Domox SA
-- Esquema de Supabase: catálogo de propiedades + métricas del sitio
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO → Run.
-- Se puede volver a ejecutar cuantas veces haga falta: no borra datos.
--
-- Después de correrlo quedan dos pasos a mano (ver el bloque LISTO del final):
--   1) Authentication → Users → Add user → email + contraseña de Kevin.
--   2) Anotar ese usuario en la tabla `admins`.
--   Sin el paso 2 el usuario entra al panel pero no ve ni toca nada.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1. ADMINS (quién puede usar el panel)
--
--    Estar autenticado NO alcanza para administrar el sitio. La anon key
--    viaja pública en el JavaScript, así que si las políticas se apoyaran
--    sólo en `authenticated`, a cualquiera que se registre en el proyecto le
--    quedaría el mismo poder que a Kevin. El permiso se decide acá.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  email      text,
  creado_en  timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Esta tabla no se escribe desde el navegador: se administra sólo desde el
-- SQL Editor. Cada admin, como mucho, puede ver su propia fila.
drop policy if exists "admin ve su propia fila" on public.admins;
create policy "admin ve su propia fila"
  on public.admins for select
  to authenticated
  using (usuario_id = auth.uid());

-- security definer: la función lee `admins` salteando el RLS de esa tabla.
-- Si no, cada política que la invoca volvería a consultar `admins`, que a su
-- vez dispara su política, y se cae por recursión.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.admins where usuario_id = auth.uid());
$$;

revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;


-- ---------------------------------------------------------------------------
-- 2. PROPIEDADES (catálogo)
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

-- Sólo los usuarios anotados en `admins`, no cualquiera que se autentique.
drop policy if exists "panel administra propiedades" on public.propiedades;
create policy "panel administra propiedades"
  on public.propiedades for all
  to authenticated
  using (public.es_admin()) with check (public.es_admin());

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
-- 3. EVENTOS (métricas)
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

-- La lectura queda reservada a los admins del panel.
drop policy if exists "panel puede leer eventos" on public.eventos;
create policy "panel puede leer eventos"
  on public.eventos for select
  to authenticated
  using (public.es_admin());


-- ---------------------------------------------------------------------------
-- 4. VISTAS DE APOYO (opcionales, para mirar desde el SQL Editor)
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
-- 5. STORAGE — bucket público `propiedades` para las fotos
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

-- Sólo los admins suben, reemplazan y borran fotos.
drop policy if exists "panel sube fotos" on storage.objects;
create policy "panel sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'propiedades' and public.es_admin());

drop policy if exists "panel actualiza fotos" on storage.objects;
create policy "panel actualiza fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'propiedades' and public.es_admin())
  with check (bucket_id = 'propiedades' and public.es_admin());

drop policy if exists "panel borra fotos" on storage.objects;
create policy "panel borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'propiedades' and public.es_admin());


-- ---------------------------------------------------------------------------
-- 6. EL ADMIN DEL PANEL
--
--    Poné abajo el email del usuario que administra el sitio y listo: si ese
--    usuario ya existe en Authentication, queda habilitado solo.
--
--    El orden no importa. Si todavía no lo creaste, esto no hace nada y no
--    falla; creá el usuario en Authentication → Users → Add user y volvé a
--    ejecutar este archivo entero, que es re-ejecutable a propósito.
-- ---------------------------------------------------------------------------
do $$
declare
  -- ↓↓↓ EDITAR: el email del usuario de Supabase Auth que entra a /admin ↓↓↓
  email_admin text := 'kevin@ejemplo.com';
  encontrado  int;
begin
  insert into public.admins (usuario_id, email)
  select id, email from auth.users where email = email_admin
  on conflict (usuario_id) do nothing;

  select count(*) into encontrado from public.admins;

  if encontrado = 0 then
    raise notice 'Sin admins todavía: no existe ningún usuario con el email %. Crealo en Authentication → Users y volvé a correr este archivo.', email_admin;
  else
    raise notice 'Listo: % admin(s) habilitado(s) para el panel.', encontrado;
  end if;
end $$;

-- Para mirarlo cuando quieras:  select * from public.admins;


-- ---------------------------------------------------------------------------
-- 7. LISTO
--
--    Con ese email y esa contraseña se entra a
--    https://kevinamoroso.vercel.app/admin
--
--    Si el usuario existe pero no está en `admins`, el panel no lo deja entrar
--    y se lo dice: es el comportamiento esperado, no un error.
--
--    Queda un solo paso que no se puede hacer desde acá, en el dashboard:
--    Authentication → Sign In / Providers → Email → desactivar
--    "Allow new users to sign up". Hoy está habilitado, o sea que cualquiera
--    puede crearse una cuenta en el proyecto. Con las políticas de arriba ya
--    no le alcanza para tocar nada, pero no hay motivo para dejar abierto el
--    registro en un sitio de una sola persona.
-- ---------------------------------------------------------------------------
