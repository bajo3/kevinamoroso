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
assets/videos/          hero-720.mp4 (loop del hero, ya comprimido)
supabase/schema.sql     Tablas, políticas, vistas y bucket listos para ejecutar
vercel.json             Ruta /admin, cabeceras de caché y seguridad
```

Las **fotos de las propiedades ya no viven en el repositorio**: se suben desde
el panel y quedan en Supabase Storage.

---

## Panel de administración — `/admin`

https://kevinamoroso.vercel.app/admin · se entra con **email y contraseña de
Supabase Auth** (no hay usuario "admin" hardcodeado).

Tiene dos secciones.

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

---

## Puesta en marcha de Supabase (una sola vez)

**1. Crear las tablas.** Supabase → **SQL Editor** → **New query** → pegar todo
`supabase/schema.sql` → **Run**. Crea `propiedades` y `eventos`, las políticas
de acceso, las vistas de resumen y el bucket `propiedades` de Storage con sus
permisos. Se puede volver a ejecutar sin perder datos.

**2. Crear el usuario del panel.** Supabase → **Authentication → Users → Add
user** → email y contraseña. Ese es el acceso a `/admin`.

Listo. La URL del proyecto y la *anon key* ya están en
`assets/js/supabase.js`; no hay nada más que completar.

### Cómo quedan los permisos

| Quién | Propiedades | Eventos | Fotos |
|---|---|---|---|
| Visitante del sitio (anon key) | lee sólo las publicadas | sólo inserta | sólo ve |
| Panel (usuario autenticado) | lee y escribe todo | lee todo | sube y borra |

La *anon key* viaja en el JavaScript y es pública por diseño: quien la copie no
puede leer las métricas ni tocar el catálogo, porque eso lo decide el RLS de la
base. La `service_role` **nunca** va en el frontend — vive sólo en `.env`, que
está en `.gitignore`.

---

## Efectos e interacción

| Efecto | Dónde | Detalle |
|---|---|---|
| Pantalla de carga | todas | Anillo de progreso 0→100 con el sello C21 al centro. Completa en ~1,2 s la primera vez y ~0,5 s al navegar entre páginas (se recuerda con `sessionStorage`). Tope duro de 2,6 s: si una foto tarda, no retiene al usuario. |
| Transición entre páginas | todas | Fundido al hacer clic en un enlace interno. No intercepta WhatsApp, `mailto:`, `tel:` ni enlaces externos. |
| Barra de lectura | todas | Línea dorada arriba que avanza con el scroll. |
| Revelado al scroll | todas | Tarjetas con desplazamiento escalonado; títulos con máscara. Se mide por posición, no con `IntersectionObserver`, para que el contenido no pueda quedar invisible. |
| Contadores | home | Métricas del hero y estadísticas cuentan desde cero al entrar en pantalla. |
| Parallax | heros | La foto de fondo se mueve más lento y el texto se desvanece al bajar. |
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

`assets/videos/hero-720.mp4` es un loop de 24 s (4,2 MB) hecho con el original
de 201 MB: se recortaron 12 s de la toma aérea de la plaza San Martín y se
duplicaron en reversa, así el bucle no tiene salto. El original queda fuera del
repositorio por `.gitignore`.

Se enciende sólo en pantallas de 900 px o más, con la conexión en buen estado y
sin ahorro de datos ni `prefers-reduced-motion`. En el celular queda la foto
`assets/img/hero-video-poster.jpg`, que es el primer cuadro del video, de modo
que no se nota el cambio.

Para reemplazarlo por otra toma:

```bash
ffmpeg -y -ss 14 -t 12 -i original.mp4 -filter_complex "[0:v]scale=1280:-2,fps=25,setpts=PTS-STARTPTS,split[f][r];[r]reverse,select='gt(n\,0)',setpts=PTS-STARTPTS[rv];[f][rv]concat=n=2:v=1[out]" -map "[out]" -an -c:v libx264 -crf 31 -maxrate 1800k -bufsize 3600k -preset slow -g 50 -movflags +faststart assets/videos/hero-720.mp4
```

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
