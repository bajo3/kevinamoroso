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
   operacion: 'venta' | 'compra-directa'
   estado:    'disponible' | 'reservada' | 'vendida'
   -------------------------------------------------------------------------- */
const PROPIEDADES = [
  {
    id: 'KA-1001',
    titulo: 'Casa de 3 dormitorios con pileta y quincho en Barrio Norte',
    tipo: 'casa', zona: 'norte', operacion: 'venta', estado: 'disponible',
    precio: 189000, moneda: 'USD',
    dormitorios: 3, banos: 2, cocheras: 2, m2: 210, m2Terreno: 400, antiguedad: 8,
    direccion: 'Iturraspe al 1400',
    destacada: true, nueva: true,
    imagenes: ['p01','p02','p03','p04','p05'],
    resumen: 'Casa en una planta sobre lote propio, con galería cubierta, quincho con parrilla y pileta de 7×3.',
    descripcion: [
      'Excelente casa de 3 dormitorios ubicada en una de las zonas más consolidadas de Barrio Norte, a cinco cuadras del centro comercial y con transporte urbano a media cuadra.',
      'Se desarrolla en una sola planta: living comedor integrado a cocina con isla, tres dormitorios (el principal en suite con vestidor), dos baños completos y lavadero independiente.',
      'El fondo cuenta con galería cubierta, quincho con parrilla de material, pileta de 7×3 con solárium y jardín parquizado con riego. Cochera cubierta para dos autos.'
    ],
    amenities: ['Pileta', 'Quincho con parrilla', 'Suite principal', 'Cocina con isla', 'Aire acondicionado', 'Calefacción por radiadores', 'Lavadero independiente', 'Jardín parquizado'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento', 'Fibra óptica']
  },
  {
    id: 'KA-1002',
    titulo: 'Chalet familiar a estrenar de 4 dormitorios en Villa Casey',
    tipo: 'casa', zona: 'casey', operacion: 'venta', estado: 'disponible',
    precio: 265000, moneda: 'USD',
    dormitorios: 4, banos: 3, cocheras: 2, m2: 280, m2Terreno: 600, antiguedad: 0,
    direccion: 'Los Tilos al 800',
    destacada: true, nueva: true,
    imagenes: ['p06','p07','p08','p09','p10'],
    resumen: 'Obra nueva de dos plantas con terminaciones premium, entrega inmediata y garantía de obra.',
    descripcion: [
      'Chalet a estrenar sobre lote de 600 m² en Villa Casey, listo para habitar y con garantía de obra de 24 meses.',
      'Planta baja: hall de entrada doble altura, living comedor de 45 m², cocina equipada con muebles a medida, toilette, dormitorio en suite y lavadero.',
      'Planta alta: tres dormitorios, dos baños completos y estar íntimo con salida a balcón terraza. Aberturas de aluminio con DVH en toda la casa y piso porcelánico símil madera.'
    ],
    amenities: ['A estrenar', 'Doble altura', 'DVH en aberturas', 'Cocina equipada', 'Dos suites', 'Balcón terraza', 'Piso radiante', 'Garantía de obra'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento']
  },
  {
    id: 'KA-1003',
    titulo: 'Casa de 2 dormitorios con patio y cochera en Barrio Fátima',
    tipo: 'casa', zona: 'fatima', operacion: 'venta', estado: 'disponible',
    precio: 92000, moneda: 'USD',
    dormitorios: 2, banos: 1, cocheras: 1, m2: 95, m2Terreno: 250, antiguedad: 22,
    direccion: 'Pueyrredón al 2100',
    destacada: false, nueva: false,
    imagenes: ['p11','p12','p13','p14'],
    resumen: 'Ideal primera vivienda o inversión para renta. Muy buen estado general y patio con quincho.',
    descripcion: [
      'Casa sólida de dos dormitorios en Barrio Fátima, a tres cuadras de la Escuela Nº 6 y con acceso rápido a Ruta 8.',
      'Distribución: living comedor, cocina independiente con alacenas, dos dormitorios con placard y baño completo con antebaño.',
      'Patio de 12 metros de fondo con quincho techado, pileta de material para lavado y espacio para huerta. Cochera descubierta con portón corredizo.'
    ],
    amenities: ['Patio amplio', 'Quincho techado', 'Placards', 'Portón corredizo', 'Termotanque a gas'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento']
  },
  {
    id: 'KA-1004',
    titulo: 'Dúplex de 3 dormitorios en complejo cerrado — Santa Rosa de Lima',
    tipo: 'duplex', zona: 'santa-rosa', operacion: 'venta', estado: 'disponible',
    precio: 138000, moneda: 'USD',
    dormitorios: 3, banos: 2, cocheras: 1, m2: 140, m2Terreno: 180, antiguedad: 4,
    direccion: 'Complejo Los Robles — Saavedra al 3200',
    destacada: true, nueva: false,
    imagenes: ['p15','p16','p17','p18'],
    resumen: 'Dúplex en complejo con seguridad 24 h, espacios verdes comunes y bajas expensas.',
    descripcion: [
      'Dúplex en el complejo cerrado Los Robles, con acceso controlado las 24 horas, calles internas iluminadas y áreas verdes de uso común.',
      'Planta baja con living comedor, cocina integrada, toilette y patio propio con parrilla. Planta alta con tres dormitorios y dos baños completos.',
      'Expensas bajas que incluyen seguridad, mantenimiento de espacios comunes y recolección interna. Cochera cubierta asignada.'
    ],
    amenities: ['Complejo cerrado', 'Seguridad 24 h', 'Patio con parrilla', 'Cochera cubierta', 'Espacios verdes', 'Expensas bajas'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento', 'Fibra óptica']
  },
  {
    id: 'KA-1005',
    titulo: 'Departamento de 2 ambientes a estrenar en pleno Centro',
    tipo: 'depto', zona: 'centro', operacion: 'venta', estado: 'disponible',
    precio: 74000, moneda: 'USD',
    dormitorios: 1, banos: 1, cocheras: 0, m2: 52, m2Terreno: 0, antiguedad: 0,
    direccion: 'San Martín al 700, piso 4',
    destacada: false, nueva: true,
    imagenes: ['p19','p20','p21'],
    resumen: 'Unidad al frente con balcón, en edificio nuevo con ascensor y terraza común.',
    descripcion: [
      'Departamento de dos ambientes a estrenar sobre San Martín, en el corazón comercial de Venado Tuerto.',
      'Unidad al frente con balcón corrido, living comedor con cocina integrada, dormitorio con placard y baño completo con ducha escocesa.',
      'El edificio cuenta con ascensor, hall de acceso, terraza común con parrillas y sistema de portero visor. Excelente opción para renta permanente.'
    ],
    amenities: ['A estrenar', 'Balcón al frente', 'Ascensor', 'Terraza común con parrilla', 'Portero visor', 'Cocina integrada'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Fibra óptica']
  },
  {
    id: 'KA-1006',
    titulo: 'Casa quinta con parque de 2.000 m² y pileta en zona de chacras',
    tipo: 'quinta', zona: 'progreso', operacion: 'venta', estado: 'disponible',
    precio: 215000, moneda: 'USD',
    dormitorios: 3, banos: 2, cocheras: 3, m2: 190, m2Terreno: 2000, antiguedad: 15,
    direccion: 'Camino de las Chacras km 3',
    destacada: true, nueva: false,
    imagenes: ['p22','p23','p24','p25','p26'],
    resumen: 'Parque añejo con más de 40 árboles, pileta de 9×4, quincho cerrado y galpón taller.',
    descripcion: [
      'Casa quinta sobre lote de 2.000 m² a solo 3 km del centro, con parque añejo, riego automático y arboleda consolidada.',
      'La casa tiene living con hogar a leña, comedor diario, cocina amplia, tres dormitorios y dos baños completos.',
      'En el exterior: pileta de 9×4 con bomba y filtro nuevos, quincho cerrado con parrilla y horno de barro, galpón taller de 60 m² y cochera para tres vehículos.'
    ],
    amenities: ['Parque de 2.000 m²', 'Pileta 9×4', 'Hogar a leña', 'Horno de barro', 'Galpón taller', 'Riego automático', 'Perforación propia'],
    servicios: ['Agua de perforación', 'Luz eléctrica', 'Gas envasado', 'Camino consolidado']
  },
  {
    id: 'KA-1007',
    titulo: 'PH al frente de 2 dormitorios reciclado a nuevo — Barrio Ottone',
    tipo: 'ph', zona: 'ottone', operacion: 'venta', estado: 'reservada',
    precio: 86000, moneda: 'USD',
    dormitorios: 2, banos: 1, cocheras: 1, m2: 88, m2Terreno: 140, antiguedad: 35,
    direccion: 'Chacabuco al 1500',
    destacada: false, nueva: false,
    imagenes: ['p27','p28','p29'],
    resumen: 'Reciclado integral en 2023: instalación eléctrica, sanitarios y techos nuevos.',
    descripcion: [
      'PH al frente sin expensas, totalmente reciclado durante 2023 con instalación eléctrica nueva, cañerías de agua renovadas y techos con membrana.',
      'Living comedor, cocina nueva con mesada de granito, dos dormitorios y baño completo con box de ducha.',
      'Patio propio con lavadero cubierto y cochera descubierta al frente. Listo para habitar.'
    ],
    amenities: ['Reciclado a nuevo', 'Sin expensas', 'Patio propio', 'Instalación nueva', 'Mesada de granito'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento']
  },
  {
    id: 'KA-1008',
    titulo: 'Terreno de 300 m² apto dúplex en Barrio Belgrano',
    tipo: 'terreno', zona: 'belgrano', operacion: 'venta', estado: 'disponible',
    precio: 38000, moneda: 'USD',
    dormitorios: 0, banos: 0, cocheras: 0, m2: 0, m2Terreno: 300, antiguedad: 0,
    direccion: 'Alvear al 2600',
    destacada: false, nueva: false,
    imagenes: ['p30','p13','p14'],
    resumen: 'Lote de 10×30 con todos los servicios en la vereda y escritura inmediata.',
    descripcion: [
      'Terreno de 10 metros de frente por 30 de fondo en Barrio Belgrano, sobre calle pavimentada y con todos los servicios disponibles en la vereda.',
      'Zonificación apta para vivienda unifamiliar o dúplex. Sin construcciones a demoler y con nivel de calle.',
      'Documentación al día: plano de mensura aprobado, libre deuda municipal y escritura inmediata.'
    ],
    amenities: ['10×30 m', 'Apto dúplex', 'Nivel de calle', 'Escritura inmediata', 'Plano de mensura'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento', 'Alumbrado']
  },
  {
    id: 'KA-1009',
    titulo: 'Casa de 3 dormitorios con local comercial al frente — Centro',
    tipo: 'casa', zona: 'centro', operacion: 'venta', estado: 'disponible',
    precio: 168000, moneda: 'USD',
    dormitorios: 3, banos: 2, cocheras: 1, m2: 175, m2Terreno: 300, antiguedad: 30,
    direccion: 'Belgrano al 900',
    destacada: false, nueva: false,
    imagenes: ['p04','p05','p06','p07'],
    resumen: 'Doble renta: vivienda al fondo y local comercial de 40 m² con vidriera a la calle.',
    descripcion: [
      'Propiedad de uso mixto sobre calle Belgrano, con local comercial independiente al frente y vivienda al fondo con entrada propia.',
      'El local tiene 40 m², vidriera completa, baño y depósito. Actualmente alquilado con contrato vigente.',
      'La vivienda cuenta con living comedor, cocina, tres dormitorios, dos baños y patio con parrilla. Excelente oportunidad de inversión con renta asegurada.'
    ],
    amenities: ['Doble renta', 'Local con vidriera', 'Entradas independientes', 'Patio con parrilla', 'Contrato vigente'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento', 'Fibra óptica']
  },
  {
    id: 'KA-1010',
    titulo: 'Dúplex de 2 dormitorios a estrenar en Barrio Norte',
    tipo: 'duplex', zona: 'norte', operacion: 'venta', estado: 'disponible',
    precio: 112000, moneda: 'USD',
    dormitorios: 2, banos: 2, cocheras: 1, m2: 105, m2Terreno: 150, antiguedad: 0,
    direccion: 'Maipú al 1900',
    destacada: true, nueva: true,
    imagenes: ['p08','p09','p10','p11'],
    resumen: 'Entrega en 60 días. Financiación directa con el desarrollador hasta 24 cuotas.',
    descripcion: [
      'Dúplex a estrenar en Barrio Norte, con entrega prevista en 60 días y posibilidad de elegir terminaciones.',
      'Planta baja con living comedor, cocina con muebles bajo mesada, toilette y patio propio. Planta alta con dos dormitorios con placard y baño completo.',
      'El desarrollador ofrece financiación directa de hasta 24 cuotas sobre el 30 % del valor, sin interés en pesos ajustables.'
    ],
    amenities: ['A estrenar', 'Financiación directa', 'Patio propio', 'Elección de terminaciones', 'Cochera'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento']
  },
  {
    id: 'KA-1011',
    titulo: 'Departamento de 3 ambientes con cochera frente a Plaza San Martín',
    tipo: 'depto', zona: 'centro', operacion: 'venta', estado: 'disponible',
    precio: 118000, moneda: 'USD',
    dormitorios: 2, banos: 2, cocheras: 1, m2: 84, m2Terreno: 0, antiguedad: 6,
    direccion: 'Mitre al 600, piso 6',
    destacada: false, nueva: false,
    imagenes: ['p12','p15','p16','p19'],
    resumen: 'Piso alto con vista despejada a la plaza, dos baños y cochera cubierta en el subsuelo.',
    descripcion: [
      'Departamento de tres ambientes en sexto piso, con vista frontal despejada a Plaza San Martín y muy buena luminosidad durante todo el día.',
      'Living comedor con salida a balcón, cocina separada con lavadero, dormitorio principal en suite y segundo dormitorio con placard.',
      'Incluye cochera cubierta en el subsuelo del edificio. Expensas moderadas con servicio de encargado permanente.'
    ],
    amenities: ['Vista a la plaza', 'Suite principal', 'Cochera cubierta', 'Balcón', 'Encargado permanente', 'Ascensor'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Fibra óptica']
  },
  {
    id: 'KA-1012',
    titulo: 'Casa de 4 dormitorios con dependencia de servicio — Villa Casey',
    tipo: 'casa', zona: 'casey', operacion: 'venta', estado: 'vendida',
    precio: 240000, moneda: 'USD',
    dormitorios: 4, banos: 3, cocheras: 2, m2: 260, m2Terreno: 500, antiguedad: 12,
    direccion: 'Las Acacias al 1200',
    destacada: false, nueva: false,
    imagenes: ['p20','p21','p22','p23'],
    resumen: 'Operación cerrada en 2024. Consultá por propiedades similares en la zona.',
    descripcion: [
      'Propiedad vendida. La dejamos publicada como referencia de valores de la zona de Villa Casey.',
      'Si buscás una casa de características similares, escribinos: trabajamos con cartera de propiedades que aún no salieron al mercado.'
    ],
    amenities: ['Dependencia de servicio', 'Doble cochera', 'Parque', 'Quincho'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Pavimento']
  },
  {
    id: 'KA-1013',
    titulo: 'Local comercial de 120 m² sobre avenida con alta circulación',
    tipo: 'local', zona: 'centro', operacion: 'venta', estado: 'disponible',
    precio: 155000, moneda: 'USD',
    dormitorios: 0, banos: 2, cocheras: 0, m2: 120, m2Terreno: 160, antiguedad: 18,
    direccion: 'Av. Casey al 1100',
    destacada: false, nueva: false,
    imagenes: ['p24','p25','p26','p27'],
    resumen: 'Salón principal sin columnas, dos baños, depósito y entrepiso para oficinas.',
    descripcion: [
      'Local comercial sobre Avenida Casey, una de las arterias de mayor circulación vehicular y peatonal de la ciudad.',
      'Salón principal de 90 m² sin columnas, con vidriera de 8 metros y cortina metálica motorizada. Dos baños (uno apto para personas con discapacidad) y depósito de 30 m².',
      'Entrepiso de 25 m² acondicionado como oficina, con aire acondicionado y cableado de red instalado.'
    ],
    amenities: ['Vidriera de 8 m', 'Sin columnas', 'Entrepiso oficina', 'Cortina motorizada', 'Baño accesible', 'Depósito'],
    servicios: ['Agua corriente', 'Cloacas', 'Gas natural', 'Trifásica', 'Fibra óptica']
  },
  {
    id: 'KA-1014',
    titulo: 'Campo agrícola de 47 hectáreas a 18 km de Venado Tuerto',
    tipo: 'campo', zona: 'progreso', operacion: 'venta', estado: 'disponible',
    precio: 690000, moneda: 'USD',
    dormitorios: 0, banos: 1, cocheras: 0, m2: 0, m2Terreno: 470000, antiguedad: 0,
    direccion: 'Ruta Provincial 94, km 18',
    destacada: false, nueva: false,
    imagenes: ['p28','p29','p30','p01'],
    resumen: 'Índice de productividad 82. Campo mixto con casco, molino y alambrados en buen estado.',
    descripcion: [
      'Fracción de 47 hectáreas con salida a Ruta Provincial 94, a 18 km del casco urbano de Venado Tuerto.',
      'Suelo clase I y II con índice de productividad 82, apto para agricultura continua. Historial de rindes disponible para el interesado.',
      'Mejoras: casco de 90 m² con baño, galpón de chapa, molino con tanque australiano, corrales y alambrados perimetrales en buen estado.'
    ],
    amenities: ['47 hectáreas', 'IP 82', 'Salida a ruta', 'Casco y galpón', 'Molino y australiano', 'Alambrados nuevos'],
    servicios: ['Luz eléctrica', 'Agua de molino', 'Camino de ripio']
  }
];

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
