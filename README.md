# Kevin Amoroso — CENTURY 21 Domox SA

Sitio web para el asesor inmobiliario **Kevin Amoroso** (Venado Tuerto, Santa Fe),
enfocado en **compra y venta de casas**, tomando como referencia estructural
[vanzini.com.ar](https://www.vanzini.com.ar/) y aplicando la identidad visual del
BrandBook *Identidad Visual Redes* de CENTURY 21 Domox SA.

HTML, CSS y JavaScript puros: sin build ni dependencias. El catálogo y las
métricas viven en **Supabase**, y se administran desde `/admin`.

**En línea:** https://kevinamoroso.vercel.app
**Repositorio:** https://github.com/bajo3/kevinamoroso

El proyecto de Vercel está conectado al repo: cada `git push` a `main`
publica automáticamente. Para desplegar a mano: `vercel deploy --prod`.

---

## Cómo verlo

Abrí `index.html` directamente en el navegador, o levantá un servidor local:

```bash
python -m http.server 5173
```

Después entrá a `http://localhost:5173`.

---

## Identidad de marca aplicada

| Elemento | Valor | Origen |
|---|---|---|
| Color principal | `#BEAE89` (oro) | BrandBook, "Paleta de color" |
| Color secundario | `#3F3F40` (grafito) | BrandBook, "Paleta de color" |
| Color de apoyo | `#FFFFFF` | BrandBook, "Paleta de color" |
| Tipografía | Aileron (auto-alojada en `assets/fonts/`) | BrandBook, "Tipografía principal" |
| Recurso gráfico | Asterisco / sello C21 | BrandBook, portada y cierre |
| Logo | Lockup "CENTURY 21 / Domox SA" | BrandBook, "Logo principal" |

Los tokens de color viven en `:root` dentro de `assets/css/styles.css`.

---

## Estructura

```
index.html          Home: hero, buscador, destacadas, servicios, proceso,
                    perfil, categorías, barrios, testimonios, FAQ, contacto
propiedades.html    Catálogo con filtros (tipo, zona, dormitorios, precio) y orden
propiedad.html      Ficha individual — se carga con ?id=KA-1001
comprar.html        Guía de compra, gastos de escrituración, búsqueda personalizada
vender.html         Propuesta de venta + formulario de tasación
nosotros.html       Perfil de Kevin, misión/visión/valores, respaldo de la red
contacto.html       Datos de contacto, mapa y formulario

assets/css/styles.css   Sistema visual completo
assets/js/data.js       ← DATOS DE CONTACTO, TIPOS Y BARRIOS (editá acá)
assets/js/main.js       Lógica: filtros, galería, formularios, favoritos
admin.html          Panel de administración (también accesible en /admin)

assets/js/supabase.js   ← CONEXIÓN CON SUPABASE (URL, anon key, auth, storage)
assets/js/preloader.js  Pantalla de carga + transición entre páginas
assets/js/analytics.js  Registro de métricas
assets/js/admin.js      Lógica del panel: catálogo + métricas
assets/css/admin.css    Estilos del panel
assets/fonts/           Aileron (.woff)
assets/img/             Hero, retrato, zonas y marcador sin-foto
assets/videos/          hero-1080-av1.mp4 + hero-1080-h264.mp4 (loop del hero)
supabase/schema.sql     Tablas, políticas, vistas y bucket listos para ejecutar
vercel.json             Ruta /admin, cabeceras de caché y seguridad
```

Las **fotos de las propiedades ya no viven en el repositorio**: se suben desde
el panel y quedan en Supabase Storage.

---

## Panel de administración — `/admin`

https://kevinamoroso.vercel.app/admin · se entra con **email y contraseña de
Supabase Auth** (no hay usuario "admin" hardcodeado).

Tiene tres secciones.

### Propiedades

Es el lugar donde se carga y se mantiene el catálogo. No hace falta tocar
ningún archivo para publicar una casa.

- Listado con foto, referencia, zona, precio, estado y cantidad de fotos
- Búsqueda por título / referencia / dirección y filtro por estado
- **Publicar / despublicar** con un clic (una publicación despublicada queda
  como borrador: se guarda pero no se ve en el sitio)
- Alta y edición en un panel lateral con todos los campos de la ficha
- Fotos: se arrastran a la caja o se eligen del disco. Antes de subirse se
  achican a 1920 px y se convierten a JPG en el navegador — una foto de celular
  de 6 MB queda en unos 300 KB — respetando la orientación EXIF para que las
  verticales no salgan acostadas. Se reordenan arrastrando; la primera es la
  portada
- Eliminar borra también las fotos del bucket, así no queda basura en Storage
- La referencia (`KA-1001`, `KA-1002`…) se calcula sola

### Métricas

Para el período elegido (7 / 30 / 90 días o todo):

- Visitantes únicos, visitas de página y vistas de ficha de propiedad
- Clics en WhatsApp y consultas enviadas por formulario
- Conversión: qué porcentaje de personas intentó contactar
- Porcentaje de visitas desde el celular
- Gráfico de visitas por día
- Ranking de propiedades más vistas, con sus clics de WhatsApp
- Páginas más visitadas y de dónde llega la gente (Google, Instagram, directo…)
- Últimos 40 movimientos, exportables a CSV

### Cuenta

Cambio de contraseña sin pasar por el dashboard de Supabase. Pide la contraseña
actual antes de aceptar la nueva: si alguien encuentra la sesión abierta en una
máquina prestada, no puede dejar a Kevin afuera de su propio panel.

Mínimo 8 caracteres. La sesión abierta sigue valiendo después del cambio, así
que no hace falta volver a entrar.

Esto sirve para *cambiar* la contraseña, no para recuperarla: si te la olvidás y
no podés entrar, se restablece desde Supabase → Authentication → Users.

---

## Puesta en marcha de Supabase (una sola vez)

**1. Crear las tablas.** Supabase → **SQL Editor** → **New query** → pegar todo
`supabase/schema.sql` → **Run**. Crea `propiedades` y `eventos`, las políticas
de acceso, las vistas de resumen y el bucket `propiedades` de Storage con sus
permisos. Se puede volver a ejecutar sin perder datos.

**2. Crear el usuario del panel.** Supabase → **Authentication → Users → Add
user** → email y contraseña.

Antes de ejecutar el schema, editá el email que está al final del archivo
(sección 6, marcado con `EDITAR`): ese usuario queda habilitado como admin
solo. El orden entre los pasos 1 y 2 no importa — si ejecutás el schema antes
de crear el usuario, no falla: avisa que todavía no hay admins y basta con
volver a ejecutarlo después.

Crear el usuario **no alcanza** por sí solo: si no está en la tabla `admins`,
el panel no lo deja entrar.

**3. Cerrar el registro público.** Supabase → **Authentication → Sign In /
Providers → Email** → desactivar *"Allow new users to sign up"*. Viene
habilitado de fábrica y no hay razón para dejar que cualquiera se cree una
cuenta en el proyecto.

La URL del proyecto y la *anon key* ya están en `assets/js/supabase.js`; no hay
nada más que completar.

### Cómo quedan los permisos

| Quién | Propiedades | Eventos | Fotos |
|---|---|---|---|
| Visitante del sitio (anon key) | lee sólo las publicadas | sólo inserta | sólo ve |
| Autenticado que **no** está en `admins` | nada | nada | sólo ve |
| Panel (usuario en `admins`) | lee y escribe todo | lee todo | sube y borra |

El permiso no se lo da estar autenticado sino estar en `admins`, y eso es a
propósito. La *anon key* viaja en el JavaScript y es pública por diseño, así que
si las políticas se apoyaran en `authenticated` a secas, a cualquiera que se
registrara en el proyecto le quedaría el mismo poder que a Kevin. Quien copie la
anon key no puede leer las métricas ni tocar el catálogo, porque eso lo decide
el RLS de la base. La `service_role` **nunca** va en el frontend — vive sólo en
`.env`, que está en `.gitignore`.

Si un usuario entra al panel sin estar en `admins`, el panel lo saca y se lo
dice; no lo deja adentro mirando pantallas vacías.

---

## Efectos e interacción

| Efecto | Dónde | Detalle |
|---|---|---|
| Pantalla de carga | sólo la primera vez | Anillo de progreso 0→100 con el sello C21 al centro. Completa en ~1,2 s (tope duro de 2,6 s: si una foto tarda, no retiene al usuario). Se recuerda con `sessionStorage`, así que al navegar entre páginas de la misma visita no vuelve a aparecer — sólo queda el fundido de abajo. |
| Transición entre páginas | todas | Fundido al hacer clic en un enlace interno, en todas las páginas, haya habido anillo o no. No intercepta WhatsApp, `mailto:`, `tel:` ni enlaces externos. |
| Barra de lectura | todas | Línea dorada arriba que avanza con el scroll. |
| Revelado al scroll | todas | Tarjetas con desplazamiento escalonado; títulos con máscara. Se mide por posición, no con `IntersectionObserver`, para que el contenido no pueda quedar invisible. |
| Contadores | home | Métricas del hero y estadísticas cuentan desde cero al entrar en pantalla. |
| Parallax | heros | La foto de fondo se mueve más lento y el texto se desvanece al bajar. |
| Viñeta | heros | Los bordes del video/foto quedan más oscuros que el centro, para que la imagen destaque en vez de mezclarse con el resto de la página. |
| Cinta de marca | home | Banda con el asterisco del BrandBook; se pausa al pasar el mouse. |
| Destello en botones | todas | Barrido de luz diagonal al hacer hover. |
| Aparición de fotos | fichas y tarjetas | Las imágenes entran con desenfoque que se disuelve. |
| Volver arriba | todas | Aparece a partir de 700 px de scroll. |

Todo se desactiva con `prefers-reduced-motion: reduce`.

---

## ⚠️ Datos a completar antes de publicar

Todo está en el objeto `CONFIG`, al principio de `assets/js/data.js`.
Buscá la palabra **`PENDIENTE`**:

1. **`whatsapp`** — celular real de Kevin, formato internacional sin `+` ni espacios
   (ej.: `5493462123456`). Hoy figura el teléfono público de la oficina.
2. **`telefonoVisible`** — el mismo número, con formato legible.
3. **`email`** — casilla real de Kevin.
4. **`matricula`** — número de matrícula del Colegio de Corredores Inmobiliarios de Santa Fe.
5. **`direccionDetalle`** — calle y número de la sucursal.
6. **Redes** — `instagram`, `facebook`, `linkedin` apuntan hoy a la home de cada red.
7. **Foto de Kevin** — guardá el retrato como **`assets/img/kevin.jpg`** y listo:
   las tres páginas que lo muestran (`nosotros.html`, `index.html` y `propiedad.html`)
   ya apuntan a ese archivo. Mientras no exista, cada `<img>` cae automáticamente
   al marcador de posición `assets/img/kevin.svg`, así que el sitio nunca queda
   con una imagen rota.

   Formato recomendado: JPG, vertical 4:5 o cuadrado, entre 1000 y 1600 px de
   ancho, con la cara en el centro. En la ficha de propiedad se recorta en
   círculo de 56 px, y en el perfil a 4:5 (se recorta a los costados, nunca arriba
   ni abajo).

### Estado del catálogo

El catálogo se carga desde Supabase con el panel `/admin`. Mientras no haya
ninguna publicación, el sitio se adapta solo — se ocultan el buscador, las
estadísticas, las categorías y los barrios, y en su lugar aparece un bloque de
"Estamos preparando el catálogo" con acceso directo a WhatsApp. Apenas entre la
primera propiedad, todas esas secciones reaparecen sin tocar nada.

Los `TESTIMONIOS` siguen siendo **contenido de muestra** y hay que reemplazarlos
por reseñas reales. Las fotos de `assets/img/zonas/` son de Unsplash (licencia
libre) y se usan como fondo de los barrios.

---

## Cargar una propiedad

Desde **`/admin` → Propiedades → + Nueva propiedad**. Lo único obligatorio es
título, tipo, zona, estado y precio: todo lo demás se puede completar después.

Una publicación sin fotos se guarda igual y muestra un marcador
(`assets/img/sin-foto.svg`) en vez de una imagen rota, así se puede dejar
armada y sumarle las fotos cuando estén.

Si por algún motivo Supabase no responde, el sitio usa el array
`PROPIEDADES_RESPALDO` de `assets/js/data.js` (normalmente vacío). Sirve para
publicar algo a mano en una emergencia; el formato de cada objeto está
comentado ahí mismo.

Los barrios (`ZONAS`) y tipos (`TIPOS`) se editan en `assets/js/data.js`, junto
con `TESTIMONIOS` y `FAQS`. Si agregás un barrio nuevo, aparece solo en el
selector del panel y en los filtros del sitio.

---

## El video del hero

Es un loop de 24 s en 1080p hecho con el original de 201 MB: se recortaron 12 s
de la toma aérea de la plaza San Martín y se duplicaron en reversa, así el bucle
no tiene salto. El original queda fuera del repositorio por `.gitignore`.

Va en dos codecs, y el navegador elige el primero que sepa decodificar:

| Archivo | Codec | Peso | VMAF |
|---|---|---|---|
| `hero-1080-av1.mp4` | AV1 (Main@4.0) | 7,5 MB | 91 |
| `hero-1080-h264.mp4` | H.264 (High@5.1) | 11,6 MB | 89 |

AV1 lo soportan Chrome, Edge y Firefox; el H.264 cubre a Safari anterior a la 17
y a los Mac Intel. Para esta toma AV1 rinde ~40 % mejor: la misma calidad en
H.264 pediría 16 MB.

Los `<source>` de `index.html` llevan la ruta en `data-src` y `main.js` la
promueve a `src` recién cuando corresponde, así el navegador no descarga nada
antes de tiempo. El video se enciende en cualquier pantalla, celular incluido,
salvo que la conexión no dé para eso: con ahorro de datos activado o una red
lenta (2G/3G) queda la foto de portada, para no gastarle el plan de datos a
quien está en esas condiciones. `prefers-reduced-motion` también lo desactiva.

De fondo va siempre la foto `assets/img/hero-poster-1280.jpg` (o la de 1920 en
pantallas grandes, vía `srcset`), que es el primer cuadro del video: si la
conexión no da para el video, es lo único que se descarga —129 KB— y si sí, el
video entra encima con un fundido cuando arranca. El `<video>` no lleva atributo
`poster` a propósito: sería un archivo más de fondo mientras se decide si hace
falta.

> **Ojo al reemplazarlo:** `vercel.json` marca `/assets/img|videos/*` como
> `immutable` por un año. Si cambiás el contenido, cambiá también el nombre del
> archivo — si no, quien ya visitó el sitio sigue viendo el viejo hasta 12 meses.

Para reemplazarlo por otra toma (ajustá `-ss` y `-t` al tramo que quieras):

```bash
LOOP="[0:v]scale=1920:-2,fps=25,setpts=PTS-STARTPTS,split[f][r];[r]reverse,select='gt(n\,0)',setpts=PTS-STARTPTS[rv];[f][rv]concat=n=2:v=1[out]"
ffmpeg -y -ss 14 -t 12 -i original.mp4 -filter_complex "$LOOP" -map "[out]" -an -c:v libsvtav1 -crf 50 -preset 4 -g 50 -pix_fmt yuv420p -movflags +faststart assets/videos/hero-1080-av1.mp4
ffmpeg -y -ss 14 -t 12 -i original.mp4 -filter_complex "$LOOP" -map "[out]" -an -c:v libx264 -crf 30 -preset veryslow -g 50 -pix_fmt yuv420p -movflags +faststart assets/videos/hero-1080-h264.mp4
ffmpeg -y -ss 14 -i original.mp4 -vf "scale=1920:-2" -frames:v 1 -q:v 6 assets/img/hero-poster-1920.jpg
ffmpeg -y -ss 14 -i original.mp4 -vf "scale=1280:-2" -frames:v 1 -q:v 5 assets/img/hero-poster-1280.jpg
```

Si cambiás el codec o el nivel, actualizá los `codecs="…"` de los `<source>` en
`index.html`: si declaran algo que no coincide, el navegador puede descartar la
fuente sin probarla. El valor real sale de
`ffprobe -show_entries stream=profile,level`.

---

## Formularios

No hay backend. Al enviar cualquier formulario se arma un mensaje prolijo y se
abre **WhatsApp** con los datos cargados; además se ofrece un enlace `mailto:`
de respaldo. Es la opción más práctica para un asesor individual: el lead llega
al teléfono al instante y no hace falta hosting con PHP ni base de datos.

Para conectar un backend real (Formspree, Netlify Forms, un endpoint propio),
reemplazá el handler de `initFormularios()` en `assets/js/main.js` por un `fetch()`.

---

## Publicar

Al ser un sitio estático, sirve cualquier hosting: Netlify, Vercel, Cloudflare
Pages, GitHub Pages o un FTP común. Se sube la carpeta tal cual está.

Antes de publicar, actualizá el dominio en:
- el `<link rel="canonical">` de `index.html`
- `sitemap.xml`
- `robots.txt`
