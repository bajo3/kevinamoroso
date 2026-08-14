/* ==========================================================================
   data.js — Configuración del sitio y catálogo de propiedades
   Editá este archivo para actualizar datos de contacto y publicaciones.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURACIÓN — revisá y completá los datos marcados como PENDIENTE
   -------------------------------------------------------------------------- */
const CONFIG = {
  asesor: {
    nombre: 'Kevin Amoroso',
    rol: 'Asesor Inmobiliario',
    matricula: 'PENDIENTE — Nº de matrícula CCPI Santa Fe',
    // PENDIENTE: reemplazar por el celular real de Kevin (formato internacional, sin +, sin espacios)
    whatsapp: '5493462311516',
    telefonoVisible: '+54 9 3462 31-1516',
    // PENDIENTE: reemplazar por el email real de Kevin
    email: 'kevin.amoroso@c21domox.com.ar',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    linkedin: 'https://www.linkedin.com/'
  },
  oficina: {
    marca: 'CENTURY 21',
    franquicia: 'Domox SA',
    direccion: 'Venado Tuerto, Santa Fe, Argentina',
    // PENDIENTE: dirección exacta de la sucursal
    direccionDetalle: 'PENDIENTE — calle y número',
    telefono: '+54 3462 26-8811',
    email: 'contacto@c21domox.com.ar',
    horarios: 'Lunes a viernes de 9 a 13 y de 16 a 20 h · Sábados de 9 a 13 h',
    mapa: 'https://www.google.com/maps?q=Venado+Tuerto,+Santa+Fe,+Argentina&output=embed'
  },
  ciudad: 'Venado Tuerto'
};

/* Mensaje prearmado de WhatsApp */
function waLink(texto) {
  const base = `https://wa.me/${CONFIG.asesor.whatsapp}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

/* --------------------------------------------------------------------------
   TAXONOMÍAS
   -------------------------------------------------------------------------- */
const TIPOS = [
  { id: 'casa',      nombre: 'Casas',        icono: 'casa' },
  { id: 'duplex',    nombre: 'Dúplex',       icono: 'duplex' },
  { id: 'ph',        nombre: 'PH',           icono: 'ph' },
  { id: 'depto',     nombre: 'Departamentos',icono: 'depto' },
  { id: 'quinta',    nombre: 'Quintas',      icono: 'quinta' },
  { id: 'terreno',   nombre: 'Terrenos',     icono: 'terreno' },
  { id: 'local',     nombre: 'Locales',      icono: 'local' },
  { id: 'campo',     nombre: 'Campos',       icono: 'campo' }
];

const ZONAS = [
  { id: 'centro',      nombre: 'Centro',              img: 'assets/img/zonas/z1.jpg' },
  { id: 'norte',       nombre: 'Barrio Norte',        img: 'assets/img/zonas/z2.jpg' },
  { id: 'casey',       nombre: 'Villa Casey',         img: 'assets/img/zonas/z3.jpg' },
  { id: 'fatima',      nombre: 'Barrio Fátima',       img: 'assets/img/zonas/z4.jpg' },
  { id: 'santa-rosa',  nombre: 'Santa Rosa de Lima',  img: 'assets/img/zonas/z5.jpg' },
  { id: 'ottone',      nombre: 'Barrio Ottone',       img: 'assets/img/zonas/z6.jpg' },
  { id: 'progreso',    nombre: 'Barrio Progreso',     img: 'assets/img/zonas/z7.jpg' },
  { id: 'belgrano',    nombre: 'Barrio Belgrano',     img: 'assets/img/zonas/z8.jpg' }
];

const nombreTipo = id => (TIPOS.find(t => t.id === id) || {}).nombre || id;
const nombreZona = id => (ZONAS.find(z => z.id === id) || {}).nombre || id;

/* --------------------------------------------------------------------------
   PROPIEDADES

   El catálogo vive en Supabase y se carga al abrir cada página. Las
   publicaciones se dan de alta desde el panel /admin, no editando este
   archivo.

   operacion: 'venta' | 'compra-directa'
   estado:    'disponible' | 'reservada' | 'vendida'
   -------------------------------------------------------------------------- */

/* Respaldo: si Supabase no responde (o todavía no se corrió el esquema), el
   sitio usa lo que haya en esta lista. Sirve para publicar algo a mano en una
   emergencia; lo normal es dejarla vacía.

  {
    id: 'KA-1001',
    titulo: 'Casa de 3 dormitorios en Barrio Norte',
    tipo: 'casa', zona: 'norte', operacion: 'venta', estado: 'disponible',
    precio: 150000, moneda: 'USD',
    dormitorios: 3, banos: 2, cocheras: 1,
    m2: 160, m2Terreno: 300, antiguedad: 5,
    direccion: 'Belgrano al 1200',
    destacada: true, nueva: false,
    imagenes: ['p01', 'p02'],            // archivos de assets/img/propiedades/
    resumen: 'Una línea para las tarjetas y el meta description.',
    descripcion: ['Primer párrafo.', 'Segundo párrafo.'],
    amenities: ['Pileta'], servicios: ['Gas natural']
  }
*/
const PROPIEDADES_RESPALDO = [];

/* La llena cargarPropiedades(). main.js la lee después de esa promesa. */
let PROPIEDADES = [];

/* Fila de la tabla `propiedades` → objeto que usa el sitio */
function mapearPropiedad(f) {
  const lista = v => Array.isArray(v) ? v.filter(x => x != null && x !== '') : [];
  return {
    id: f.id,
    titulo: f.titulo || '',
    tipo: f.tipo || 'casa',
    zona: f.zona || '',
    operacion: f.operacion || 'venta',
    estado: f.estado || 'disponible',
    precio: Number(f.precio) || 0,
    moneda: f.moneda || 'USD',
    dormitorios: Number(f.dormitorios) || 0,
    banos: Number(f.banos) || 0,
    cocheras: Number(f.cocheras) || 0,
    m2: Number(f.m2) || 0,
    m2Terreno: Number(f.m2_terreno) || 0,
    antiguedad: Number(f.antiguedad) || 0,
    direccion: f.direccion || '',
    destacada: !!f.destacada,
    nueva: !!f.nueva,
    orden: Number(f.orden) || 0,
    resumen: f.resumen || '',
    descripcion: lista(f.descripcion),
    amenities: lista(f.amenities),
    servicios: lista(f.servicios),
    imagenes: lista(f.imagenes)
  };
}

/* Trae el catálogo publicado. Nunca rechaza: si algo falla, el sitio sigue
   funcionando con el respaldo y avisa por consola. */
function cargarPropiedades() {
  if (typeof KA_SB === 'undefined') {
    PROPIEDADES = PROPIEDADES_RESPALDO.slice();
    return Promise.resolve(PROPIEDADES);
  }
  return KA_SB.tabla
    .leerPublico('propiedades',
      '?select=*&publicada=eq.true&order=destacada.desc,orden.asc,creado_en.desc')
    .then(filas => {
      PROPIEDADES = (filas || []).map(mapearPropiedad);
      if (!PROPIEDADES.length) PROPIEDADES = PROPIEDADES_RESPALDO.slice();
      return PROPIEDADES;
    })
    .catch(e => {
      console.warn('[catálogo] no se pudo leer Supabase:', e.message);
      PROPIEDADES = PROPIEDADES_RESPALDO.slice();
      return PROPIEDADES;
    });
}

/* --------------------------------------------------------------------------
   TESTIMONIOS
   -------------------------------------------------------------------------- */
const TESTIMONIOS = [
  {
    texto: 'Vendimos la casa de mis padres en menos de dos meses. Kevin se ocupó de todo: la tasación, las visitas y hasta de coordinar con la escribanía. Cero vueltas.',
    autor: 'Mariela G.', detalle: 'Vendió en Barrio Norte'
  },
  {
    texto: 'Compramos nuestra primera casa con él. Nos explicó cada paso, nos avisó de los costos reales antes de firmar y nunca nos apuró. Se nota que trabaja con la gente, no con la comisión.',
    autor: 'Diego y Sol', detalle: 'Compraron en Villa Casey'
  },
  {
    texto: 'Vivo en Buenos Aires y necesitaba vender un inmueble en Venado. Manejó todo a distancia, con informes semanales y video llamadas. Impecable.',
    autor: 'Ricardo P.', detalle: 'Vendió en el Centro'
  }
];

/* --------------------------------------------------------------------------
   PREGUNTAS FRECUENTES
   -------------------------------------------------------------------------- */
const FAQS = [
  {
    p: '¿Cuánto tarda en venderse una propiedad en Venado Tuerto?',
    r: 'Depende del tipo de propiedad, la zona y —sobre todo— del precio de salida. Una casa bien posicionada en valor suele concretar entre 60 y 120 días. Cuando el precio está por encima del mercado, ese plazo se estira y termina bajando igual, pero después de meses de exposición. Por eso la tasación inicial es la decisión más importante de todo el proceso.'
  },
  {
    p: '¿Qué documentación necesito para vender mi casa?',
    r: 'Escritura o título de propiedad, plano de mensura, libre deuda municipal y provincial (API), últimas boletas de servicios y, si corresponde, el reglamento de copropiedad. Si la propiedad tiene sucesión en trámite o hipoteca vigente, se puede avanzar igual: lo revisamos antes de publicar para que no aparezcan sorpresas en la firma.'
  },
  {
    p: '¿Cuáles son los gastos de una compraventa?',
    r: 'Del lado del comprador: honorarios de escribanía, impuesto de sellos (se divide entre las partes en Santa Fe) y aportes. Del lado del vendedor: la comisión inmobiliaria, el certificado de libre deuda y —según el caso— el impuesto a la transferencia de inmuebles. Antes de reservar te paso el detalle completo con números concretos sobre tu operación.'
  },
  {
    p: '¿Hacen tasaciones sin compromiso?',
    r: 'Sí, la tasación es sin cargo y sin compromiso de firmar exclusividad. Visito la propiedad, tomo medidas y fotos, y comparo contra operaciones reales cerradas en la zona en los últimos 12 meses. Te entrego un informe escrito con un rango de valor y una recomendación de precio de publicación.'
  },
  {
    p: '¿Puedo comprar en cuotas o con financiación?',
    r: 'Algunos desarrollos permiten financiación directa del constructor, en general hasta el 30 % del valor en 12 a 24 cuotas. También trabajamos con operaciones con crédito hipotecario cuando el comprador ya tiene la preaprobación bancaria. En cada publicación te aclaro si admite financiación.'
  },
  {
    p: '¿Trabajás con exclusividad?',
    r: 'Recomiendo la exclusividad porque permite invertir de verdad en la propiedad: fotos profesionales, video, campaña paga y difusión en la red CENTURY 21. Dicho eso, no es obligatoria. Si preferís una publicación abierta, lo conversamos y trabajamos igual.'
  }
];
