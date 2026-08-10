# Kevin Amoroso — CENTURY 21 Domox SA

Sitio web para el asesor inmobiliario **Kevin Amoroso** (Venado Tuerto, Santa Fe),
enfocado en **compra y venta de casas**, tomando como referencia estructural
[vanzini.com.ar](https://www.vanzini.com.ar/) y aplicando la identidad visual del
BrandBook *Identidad Visual Redes* de CENTURY 21 Domox SA.

HTML, CSS y JavaScript puros. Sin build, sin dependencias, sin backend.

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
assets/js/data.js       ← CONFIGURACIÓN Y PROPIEDADES (editá acá)
assets/js/main.js       Lógica: filtros, galería, formularios, favoritos
assets/js/preloader.js  Pantalla de carga + transición entre páginas
assets/fonts/           Aileron (.woff)
assets/img/             Hero, retrato, zonas y fotos de propiedades
vercel.json             Cabeceras de caché y seguridad
```

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

### Sobre las propiedades y los testimonios

El catálogo de `PROPIEDADES` y los `TESTIMONIOS` son **contenido de muestra**
escrito para que el sitio se vea completo: direcciones, precios y textos son
verosímiles pero inventados. Hay que reemplazarlos por publicaciones reales
antes de poner el sitio online.

Las fotos provienen de Unsplash (licencia libre) y funcionan como placeholder
hasta tener la producción fotográfica propia.

---

## Cargar una propiedad nueva

Agregá un objeto al array `PROPIEDADES` en `assets/js/data.js`:

```js
{
  id: 'KA-1015',                       // referencia única, se muestra en la ficha
  titulo: 'Casa de 3 dormitorios en Barrio Norte',
  tipo: 'casa',                        // casa | duplex | ph | depto | quinta | terreno | local | campo
  zona: 'norte',                       // id de ZONAS
  operacion: 'venta',
  estado: 'disponible',                // disponible | reservada | vendida
  precio: 150000, moneda: 'USD',
  dormitorios: 3, banos: 2, cocheras: 1,
  m2: 160, m2Terreno: 300, antiguedad: 5,
  direccion: 'Belgrano al 1200',
  destacada: true,                     // aparece en la home
  nueva: false,                        // muestra la etiqueta "A estrenar"
  imagenes: ['p01', 'p02', 'p03'],     // archivos de assets/img/propiedades/
  resumen: 'Una línea para las tarjetas y el meta description.',
  descripcion: ['Primer párrafo.', 'Segundo párrafo.'],
  amenities: ['Pileta', 'Quincho'],
  servicios: ['Agua corriente', 'Gas natural']
}
```

Para sumar fotos, copialas a `assets/img/propiedades/` y referenciá el nombre
sin extensión. Se esperan `.jpg`.

Los barrios (`ZONAS`) y tipos (`TIPOS`) también se editan en ese archivo, junto
con `TESTIMONIOS` y `FAQS`.

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
