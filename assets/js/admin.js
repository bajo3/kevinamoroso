/* ==========================================================================
   admin.js — Panel de administración

   Dos secciones:
     · Propiedades → alta, edición, fotos y publicación del catálogo
     · Métricas    → visitas, contactos y conversión del sitio

   El acceso es real: Supabase Auth con email y contraseña. Sin sesión válida
   no se ve nada, y las políticas de la base impiden leer o escribir aunque
   alguien manipule el JavaScript de la página.
   ========================================================================== */
(function () {
  'use strict';

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const ICO = {
    gente:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.2"/><path d="M22 20v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.6a4 4 0 0 1 0 6.8"/></svg>',
    ojo:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    casa:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>',
    wa:     '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2s-.7 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"/></svg>',
    sobre:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>',
    rayo:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
    movil:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18.5h2"/></svg>',
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5M12 7.6h.01"/></svg>',
    cartel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h9l5 5v13"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>'
  };

  /* Marca de agua para las miniaturas sin foto */
  const SIN_FOTO = 'assets/img/sin-foto.svg';

  /* ==================================================================== */
  /*  Avisos                                                              */
  /* ==================================================================== */
  let temporizadorAviso = null;
  function avisar(texto, tipo) {
    const caja = $('#aviso-flotante');
    caja.textContent = texto;
    caja.className = 'aviso-flotante' + (tipo ? ' aviso-flotante--' + tipo : '');
    caja.hidden = false;
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => { caja.hidden = true; }, tipo === 'error' ? 7000 : 3200);
  }

  /* Traduce los errores de Supabase a algo accionable */
  function explicar(e) {
    const m = String((e && e.message) || e || '');
    if (/Could not find the table|PGRST205|does not exist/i.test(m)) {
      return 'Faltan las tablas en Supabase. Pegá el archivo supabase/schema.sql en el SQL Editor y ejecutalo.';
    }
    if (/Invalid login credentials/i.test(m)) return 'Email o contraseña incorrectos.';
    if (/Email not confirmed/i.test(m)) return 'Ese usuario todavía no confirmó el email. Confirmalo desde Supabase → Authentication → Users.';
    if (/JWT expired|invalid claim/i.test(m)) return 'La sesión venció. Volvé a entrar.';
    if (/Bucket not found/i.test(m)) return 'Falta el bucket `propiedades` en Storage. Lo crea el schema.sql.';
    if (/duplicate key|already exists/i.test(m)) return 'Ya existe una publicación con esa referencia. Cerrá el editor, actualizá el listado y volvé a intentar.';
    if (/exceeded the maximum allowed size|Payload too large/i.test(m)) return 'La foto pesa demasiado incluso después de comprimirla. Probá con una imagen más chica.';
    if (/new row violates row-level security|violates row-level/i.test(m)) return 'La base rechazó el cambio por permisos. Revisá que hayas entrado con tu usuario.';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'No hay conexión con Supabase. Revisá internet e intentá de nuevo.';
    return m || 'Ocurrió un error inesperado.';
  }

  /* ==================================================================== */
  /*  Acceso                                                              */
  /* ==================================================================== */
  function mostrarAcceso() {
    $('#acceso').hidden = false;
    $('#panel').classList.remove('activo');
    setTimeout(() => $('#usuario').focus(), 60);
  }

  function mostrarPanel() {
    $('#acceso').hidden = true;
    $('#panel').classList.add('activo');
    const u = KA_SB.auth.usuario;
    $('#panel-usuario').textContent = u ? u.email : '';
    cargarCatalogo();
  }

  $('#form-acceso').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const err = $('#acceso-error');
    const btn = $('#btn-entrar');
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Entrando…';

    try {
      await KA_SB.auth.ingresar($('#usuario').value.trim(), $('#clave').value);
      $('#clave').value = '';
      mostrarPanel();
    } catch (e) {
      err.hidden = false;
      err.textContent = explicar(e);
      $('#clave').value = '';
      $('#clave').focus();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });

  $('#btn-salir').addEventListener('click', async function () {
    await KA_SB.auth.salir();
    location.reload();
  });

  /* ==================================================================== */
  /*  Pestañas                                                            */
  /* ==================================================================== */
  let metricasCargadas = false;

  $$('.panel__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const vista = tab.dataset.vista;
      $$('.panel__tab').forEach(t => t.classList.toggle('activo', t === tab));
      $$('[data-vista-panel]').forEach(v => { v.hidden = v.dataset.vistaPanel !== vista; });
      if (vista === 'metricas' && !metricasCargadas) { metricasCargadas = true; cargarMetricas(); }
    });
  });

  /* ==================================================================== */
  /*  PROPIEDADES — listado                                               */
  /* ==================================================================== */
  let CATALOGO = [];

  const fmtPrecio = p => (p.moneda === 'ARS' ? '$ ' : 'U$D ') +
    (Number(p.precio) || 0).toLocaleString('es-AR');

  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || id || '—';

  const fotosTexto = p => {
    const n = (p.imagenes || []).length;
    return n === 0 ? 'sin fotos' : n === 1 ? '1 foto' : n + ' fotos';
  };

  async function cargarCatalogo() {
    const caja = $('#tabla-propiedades-abm');
    caja.innerHTML = '<div class="tabla-vacia">Cargando publicaciones…</div>';
    try {
      CATALOGO = await KA_SB.tabla.leer('propiedades',
        '?select=*&order=creado_en.desc') || [];
      $('#aviso-modo').innerHTML = '';
      pintarCatalogo();
    } catch (e) {
      CATALOGO = [];
      caja.innerHTML = '';
      $('#aviso-modo').innerHTML =
        `<div class="aviso-modo aviso-modo--error">${ICO.info}
           <p><strong>No se pudo leer el catálogo.</strong> ${esc(explicar(e))}</p>
         </div>`;
    }
  }

  function filtrarCatalogo() {
    const q = $('#buscar-prop').value.trim().toLowerCase();
    const estado = $('#filtro-estado').value;
    return CATALOGO.filter(p => {
      if (estado === 'borrador' && p.publicada !== false) return false;
      if (estado && estado !== 'borrador' && p.estado !== estado) return false;
      if (!q) return true;
      return [p.id, p.titulo, p.direccion, p.resumen].join(' ').toLowerCase().indexOf(q) !== -1;
    });
  }

  function pintarCatalogo() {
    pintarResumen();
    const filas = filtrarCatalogo();
    const caja = $('#tabla-propiedades-abm');

    if (!CATALOGO.length) {
      caja.innerHTML = `
        <div class="tabla-vacia tabla-vacia--grande">
          ${ICO.cartel}
          <h3>Todavía no hay publicaciones</h3>
          <p>Cargá la primera propiedad y va a aparecer en el sitio al instante.</p>
          <button class="btn" type="button" data-nueva>+ Cargar la primera propiedad</button>
        </div>`;
      const b = caja.querySelector('[data-nueva]');
      if (b) b.addEventListener('click', () => abrirEditor(null));
      return;
    }

    if (!filas.length) {
      caja.innerHTML = '<div class="tabla-vacia">Ninguna publicación coincide con la búsqueda.</div>';
      return;
    }

    caja.innerHTML = `
      <table class="tabla tabla--abm">
        <thead>
          <tr>
            <th>Propiedad</th>
            <th>Ubicación</th>
            <th class="num">Precio</th>
            <th>Estado</th>
            <th class="acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>${filas.map(filaPropiedad).join('')}</tbody>
      </table>`;

    caja.querySelectorAll('[data-editar]').forEach(b =>
      b.addEventListener('click', () => abrirEditor(CATALOGO.find(p => p.id === b.dataset.editar))));
    caja.querySelectorAll('[data-publicar]').forEach(b =>
      b.addEventListener('click', () => alternarPublicada(b.dataset.publicar, b)));
  }

  function filaPropiedad(p) {
    const foto = (p.imagenes && p.imagenes[0]) || SIN_FOTO;
    const borrador = p.publicada === false;
    const estados = {
      disponible: ['pastilla--ok', 'Disponible'],
      reservada:  ['pastilla--aviso', 'Reservada'],
      vendida:    ['pastilla--gris', 'Vendida']
    };
    const [cls, txt] = estados[p.estado] || ['', p.estado];

    return `
      <tr${borrador ? ' class="fila--borrador"' : ''}>
        <td>
          <div class="celda-prop">
            <img src="${esc(foto)}" alt="" loading="lazy" onerror="this.src='${SIN_FOTO}'">
            <div>
              <strong>${esc(p.titulo || 'Sin título')}</strong>
              <span class="ref">${esc(p.id)} · ${esc(nombreDe(TIPOS, p.tipo))} · ${fotosTexto(p)}</span>
            </div>
          </div>
        </td>
        <td>
          ${esc(nombreDe(ZONAS, p.zona))}
          ${p.direccion ? `<span class="ref">${esc(p.direccion)}</span>` : ''}
        </td>
        <td class="num">${esc(fmtPrecio(p))}</td>
        <td>
          <span class="pastilla ${cls}">${esc(txt)}</span>
          ${borrador ? '<span class="pastilla pastilla--borrador">Borrador</span>' : ''}
          ${p.destacada ? '<span class="pastilla pastilla--oro">Destacada</span>' : ''}
        </td>
        <td class="acciones">
          <button class="mini" type="button" data-editar="${esc(p.id)}">Editar</button>
          <button class="mini" type="button" data-publicar="${esc(p.id)}">${borrador ? 'Publicar' : 'Despublicar'}</button>
          <a class="mini" href="propiedad.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">Ver</a>
        </td>
      </tr>`;
  }

  function pintarResumen() {
    const total = CATALOGO.length;
    const publicadas = CATALOGO.filter(p => p.publicada !== false).length;
    const disponibles = CATALOGO.filter(p => p.estado === 'disponible' && p.publicada !== false).length;
    const destacadas = CATALOGO.filter(p => p.destacada && p.publicada !== false).length;
    const sinFoto = CATALOGO.filter(p => !(p.imagenes || []).length).length;

    $('#resumen-catalogo').innerHTML = !total ? '' : `
      <div class="resumen-catalogo__dato"><strong>${total}</strong><span>publicaciones</span></div>
      <div class="resumen-catalogo__dato"><strong>${publicadas}</strong><span>en el sitio</span></div>
      <div class="resumen-catalogo__dato"><strong>${disponibles}</strong><span>disponibles</span></div>
      <div class="resumen-catalogo__dato"><strong>${destacadas}</strong><span>destacadas</span></div>
      ${sinFoto ? `<div class="resumen-catalogo__dato resumen-catalogo__dato--aviso"><strong>${sinFoto}</strong><span>sin fotos</span></div>` : ''}`;
  }

  async function alternarPublicada(id, boton) {
    const p = CATALOGO.find(x => x.id === id);
    if (!p) return;
    const nuevo = p.publicada === false;
    boton.disabled = true;
    try {
      await KA_SB.tabla.actualizar('propiedades', '?id=eq.' + encodeURIComponent(id),
        { publicada: nuevo });
      p.publicada = nuevo;
      pintarCatalogo();
      avisar(nuevo ? 'Publicada: ya se ve en el sitio.' : 'Pasó a borrador: se ocultó del sitio.');
    } catch (e) {
      avisar(explicar(e), 'error');
      boton.disabled = false;
    }
  }

  $('#buscar-prop').addEventListener('input', pintarCatalogo);
  $('#filtro-estado').addEventListener('change', pintarCatalogo);
  $('#btn-recargar-prop').addEventListener('click', cargarCatalogo);
  $('#btn-nueva').addEventListener('click', () => abrirEditor(null));

  /* ==================================================================== */
  /*  PROPIEDADES — editor                                                */
  /* ==================================================================== */
  let editando = null;        // fila original, o null si es alta
  let fotos = [];             // URLs en el orden actual
  let fotosOriginales = [];   // para saber qué borrar si se cancela
  let subiendo = 0;

  function siguienteRef() {
    const nums = CATALOGO
      .map(p => /^KA-(\d+)$/.exec(p.id || ''))
      .filter(Boolean)
      .map(m => parseInt(m[1], 10));
    return 'KA-' + (nums.length ? Math.max.apply(null, nums) + 1 : 1001);
  }

  function poblarSelects() {
    if ($('#f-tipo').options.length) return;
    $('#f-tipo').innerHTML = TIPOS.map(t => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('');
    $('#f-zona').innerHTML = ZONAS.map(z => `<option value="${z.id}">${esc(z.nombre)}</option>`).join('');
  }

  function abrirEditor(p) {
    poblarSelects();
    editando = p || null;

    const ref = p ? p.id : siguienteRef();
    $('#editor-titulo').textContent = p ? 'Editar propiedad' : 'Nueva propiedad';
    $('#editor-ref').textContent = 'Referencia ' + ref;
    $('#editor').dataset.ref = ref;
    $('#btn-borrar-prop').hidden = !p;
    $('#editor-error').hidden = true;

    $('#f-titulo').value      = p ? (p.titulo || '') : '';
    $('#f-tipo').value        = p ? (p.tipo || 'casa') : 'casa';
    $('#f-zona').value        = p ? (p.zona || ZONAS[0].id) : ZONAS[0].id;
    $('#f-estado').value      = p ? (p.estado || 'disponible') : 'disponible';
    $('#f-direccion').value   = p ? (p.direccion || '') : '';
    $('#f-precio').value      = p ? (p.precio || '') : '';
    $('#f-moneda').value      = p ? (p.moneda || 'USD') : 'USD';
    $('#f-publicada').checked = p ? p.publicada !== false : true;
    $('#f-destacada').checked = p ? !!p.destacada : false;
    $('#f-nueva').checked     = p ? !!p.nueva : false;

    $('#f-dormitorios').value = p ? (p.dormitorios || 0) : 0;
    $('#f-banos').value       = p ? (p.banos || 0) : 0;
    $('#f-cocheras').value    = p ? (p.cocheras || 0) : 0;
    $('#f-m2').value          = p ? (p.m2 || 0) : 0;
    $('#f-m2t').value         = p ? (p.m2_terreno || 0) : 0;
    $('#f-antiguedad').value  = p ? (p.antiguedad || 0) : 0;

    $('#f-resumen').value     = p ? (p.resumen || '') : '';
    $('#f-descripcion').value = p ? (p.descripcion || []).join('\n\n') : '';
    $('#f-amenities').value   = p ? (p.amenities || []).join(', ') : '';
    $('#f-servicios').value   = p ? (p.servicios || []).join(', ') : '';

    fotos = p ? (p.imagenes || []).slice() : [];
    fotosOriginales = fotos.slice();
    pintarFotos();

    $('#editor').hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#f-titulo').focus(), 80);
  }

  async function cerrarEditor(guardado) {
    if (subiendo) {
      if (!confirm('Hay fotos subiéndose. ¿Cerrar igual?')) return;
    }
    // Las fotos que se subieron y no llegaron a guardarse no quedan ocupando lugar
    if (!guardado) {
      const huerfanas = fotos.filter(u => fotosOriginales.indexOf(u) === -1);
      if (huerfanas.length) KA_SB.storage.borrar(huerfanas);
    }
    $('#editor').hidden = true;
    document.body.style.overflow = '';
    editando = null;
    fotos = [];
    fotosOriginales = [];
    $('#input-fotos').value = '';
  }

  $$('[data-cerrar-editor]').forEach(b => b.addEventListener('click', () => cerrarEditor(false)));
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && !$('#editor').hidden) cerrarEditor(false);
  });

  /* ------------------------------------------------------------- Fotos */
  function pintarFotos() {
    const caja = $('#fotos');
    if (!fotos.length) {
      caja.innerHTML = '<p class="fotos__vacio">Sin fotos todavía. La publicación se puede guardar igual y sumarlas después.</p>';
      return;
    }
    caja.innerHTML = fotos.map((url, i) => `
      <figure class="foto${i === 0 ? ' foto--portada' : ''}" draggable="true" data-i="${i}">
        <img src="${esc(url)}" alt="Foto ${i + 1}" loading="lazy">
        ${i === 0 ? '<figcaption>Portada</figcaption>' : ''}
        <div class="foto__acciones">
          ${i > 0 ? `<button type="button" class="foto__btn" data-mover="${i}" title="Mover antes">‹</button>` : ''}
          ${i < fotos.length - 1 ? `<button type="button" class="foto__btn" data-mover-der="${i}" title="Mover después">›</button>` : ''}
          <button type="button" class="foto__btn foto__btn--quitar" data-quitar="${i}" title="Quitar">✕</button>
        </div>
      </figure>`).join('');

    caja.querySelectorAll('[data-quitar]').forEach(b =>
      b.addEventListener('click', () => quitarFoto(parseInt(b.dataset.quitar, 10))));
    caja.querySelectorAll('[data-mover]').forEach(b =>
      b.addEventListener('click', () => moverFoto(parseInt(b.dataset.mover, 10), -1)));
    caja.querySelectorAll('[data-mover-der]').forEach(b =>
      b.addEventListener('click', () => moverFoto(parseInt(b.dataset.moverDer, 10), 1)));

    armarArrastre(caja);
  }

  function moverFoto(i, delta) {
    const j = i + delta;
    if (j < 0 || j >= fotos.length) return;
    const t = fotos[i]; fotos[i] = fotos[j]; fotos[j] = t;
    pintarFotos();
  }

  function quitarFoto(i) {
    const url = fotos[i];
    fotos.splice(i, 1);
    // Sólo se borra del bucket si se había subido en esta edición; las que ya
    // estaban guardadas se limpian recién al guardar, por si se cancela.
    if (fotosOriginales.indexOf(url) === -1) KA_SB.storage.borrar([url]);
    pintarFotos();
  }

  let arrastrando = null;
  function armarArrastre(caja) {
    caja.querySelectorAll('.foto').forEach(fig => {
      fig.addEventListener('dragstart', ev => {
        arrastrando = parseInt(fig.dataset.i, 10);
        fig.classList.add('foto--arrastrando');
        ev.dataTransfer.effectAllowed = 'move';
        try { ev.dataTransfer.setData('text/plain', String(arrastrando)); } catch (e) {}
      });
      fig.addEventListener('dragend', () => {
        arrastrando = null;
        caja.querySelectorAll('.foto').forEach(f => f.classList.remove('foto--arrastrando', 'foto--destino'));
      });
      fig.addEventListener('dragover', ev => {
        ev.preventDefault();
        if (arrastrando !== null && parseInt(fig.dataset.i, 10) !== arrastrando) fig.classList.add('foto--destino');
      });
      fig.addEventListener('dragleave', () => fig.classList.remove('foto--destino'));
      fig.addEventListener('drop', ev => {
        ev.preventDefault();
        const destino = parseInt(fig.dataset.i, 10);
        if (arrastrando === null || destino === arrastrando) return;
        const movida = fotos.splice(arrastrando, 1)[0];
        fotos.splice(destino, 0, movida);
        arrastrando = null;
        pintarFotos();
      });
    });
  }

  /* Achica la foto antes de subirla: las de celular vienen de 4 a 8 MB y en el
     sitio se ven a 1400 px de ancho como máximo. */
  function comprimir(archivo) {
    const MAX = 1920, CALIDAD = 0.82;

    return cargarImagen(archivo).then(img => {
      if (!img) return archivo;
      const lado = Math.max(img.width, img.height);
      const escala = Math.min(1, MAX / lado);
      if (escala === 1 && archivo.size < 700 * 1024) return archivo;

      const lienzo = document.createElement('canvas');
      lienzo.width  = Math.round(img.width * escala);
      lienzo.height = Math.round(img.height * escala);
      const ctx = lienzo.getContext('2d');
      ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      if (img.close) img.close();

      return new Promise(resolve => {
        lienzo.toBlob(blob => {
          if (!blob || blob.size >= archivo.size) return resolve(archivo);
          const nombre = (archivo.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg';
          resolve(new File([blob], nombre, { type: 'image/jpeg' }));
        }, 'image/jpeg', CALIDAD);
      });
    }).catch(() => archivo);
  }

  /* createImageBitmap respeta la orientación EXIF: las fotos verticales de
     celular no salen acostadas. */
  function cargarImagen(archivo) {
    if (window.createImageBitmap) {
      return createImageBitmap(archivo, { imageOrientation: 'from-image' }).catch(() => cargarConImg(archivo));
    }
    return cargarConImg(archivo);
  }

  function cargarConImg(archivo) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(archivo);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  async function subirFotos(lista) {
    const archivos = Array.from(lista).filter(f => /^image\//.test(f.type));
    if (!archivos.length) return;

    const ref = $('#editor').dataset.ref;
    const caja = $('#fotos');
    subiendo += archivos.length;
    caja.insertAdjacentHTML('beforeend',
      `<p class="fotos__progreso" id="fotos-progreso">Subiendo ${archivos.length} foto${archivos.length > 1 ? 's' : ''}…</p>`);

    let listas = 0, fallidas = 0;
    for (const archivo of archivos) {
      try {
        const liviana = await comprimir(archivo);
        const url = await KA_SB.storage.subir(liviana, ref);
        fotos.push(url);
      } catch (e) {
        fallidas++;
        avisar('No se pudo subir ' + archivo.name + ': ' + explicar(e), 'error');
      }
      listas++;
      subiendo--;
      const p = $('#fotos-progreso');
      if (p) p.textContent = `Subiendo… ${listas} de ${archivos.length}`;
      pintarFotos();
    }

    if (!fallidas) avisar(archivos.length > 1 ? 'Fotos subidas.' : 'Foto subida.');
  }

  const soltar = $('#soltar-fotos');
  soltar.addEventListener('click', () => $('#input-fotos').click());
  soltar.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); $('#input-fotos').click(); }
  });
  $('#input-fotos').addEventListener('change', ev => {
    subirFotos(ev.target.files);
    ev.target.value = '';
  });
  ['dragenter', 'dragover'].forEach(t => soltar.addEventListener(t, ev => {
    ev.preventDefault(); soltar.classList.add('soltar--activo');
  }));
  ['dragleave', 'drop'].forEach(t => soltar.addEventListener(t, ev => {
    ev.preventDefault(); soltar.classList.remove('soltar--activo');
  }));
  soltar.addEventListener('drop', ev => {
    if (ev.dataTransfer && ev.dataTransfer.files.length) subirFotos(ev.dataTransfer.files);
  });

  /* ------------------------------------------------------------ Guardar */
  const listaDeTexto = t => String(t || '').split(',').map(s => s.trim()).filter(Boolean);
  const parrafos = t => String(t || '').split(/\n\s*\n/).map(s => s.trim().replace(/\n/g, ' ')).filter(Boolean);
  const entero = sel => Math.max(0, parseInt($(sel).value, 10) || 0);

  $('#form-propiedad').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const err = $('#editor-error');
    const btn = $('#btn-guardar');
    err.hidden = true;

    if (subiendo) { err.hidden = false; err.textContent = 'Esperá a que terminen de subir las fotos.'; return; }

    const fila = {
      id: $('#editor').dataset.ref,
      titulo: $('#f-titulo').value.trim(),
      tipo: $('#f-tipo').value,
      zona: $('#f-zona').value,
      operacion: 'venta',
      estado: $('#f-estado').value,
      publicada: $('#f-publicada').checked,
      precio: Math.max(0, parseFloat($('#f-precio').value) || 0),
      moneda: $('#f-moneda').value,
      dormitorios: entero('#f-dormitorios'),
      banos: entero('#f-banos'),
      cocheras: entero('#f-cocheras'),
      m2: entero('#f-m2'),
      m2_terreno: entero('#f-m2t'),
      antiguedad: entero('#f-antiguedad'),
      direccion: $('#f-direccion').value.trim(),
      destacada: $('#f-destacada').checked,
      nueva: $('#f-nueva').checked,
      resumen: $('#f-resumen').value.trim(),
      descripcion: parrafos($('#f-descripcion').value),
      amenities: listaDeTexto($('#f-amenities').value),
      servicios: listaDeTexto($('#f-servicios').value),
      imagenes: fotos.slice()
    };

    btn.disabled = true;
    btn.textContent = 'Guardando…';

    try {
      if (editando) {
        await KA_SB.tabla.actualizar('propiedades', '?id=eq.' + encodeURIComponent(fila.id), fila);
        // Fotos que se sacaron de una publicación ya guardada
        const sobrantes = fotosOriginales.filter(u => fotos.indexOf(u) === -1);
        if (sobrantes.length) KA_SB.storage.borrar(sobrantes);
      } else {
        await KA_SB.tabla.insertar('propiedades', [fila]);
      }
      await cerrarEditor(true);
      await cargarCatalogo();
      avisar(fila.publicada ? 'Guardada y publicada en el sitio.' : 'Guardada como borrador.');
    } catch (e) {
      err.hidden = false;
      err.textContent = explicar(e);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar';
    }
  });

  $('#btn-borrar-prop').addEventListener('click', async function () {
    if (!editando) return;
    if (!confirm(`¿Eliminar "${editando.titulo}" (${editando.id})?\n\nSe borran también sus fotos. No se puede deshacer.\n\nSi sólo querés sacarla del sitio, cerrá esto y usá "Despublicar".`)) return;

    const btn = this;
    btn.disabled = true;
    try {
      await KA_SB.tabla.borrar('propiedades', '?id=eq.' + encodeURIComponent(editando.id));
      const aBorrar = fotosOriginales.concat(fotos.filter(u => fotosOriginales.indexOf(u) === -1));
      if (aBorrar.length) KA_SB.storage.borrar(aBorrar);
      await cerrarEditor(true);
      await cargarCatalogo();
      avisar('Publicación eliminada.');
    } catch (e) {
      avisar(explicar(e), 'error');
    } finally {
      btn.disabled = false;
    }
  });

  /* ==================================================================== */
  /*  MÉTRICAS                                                            */
  /* ==================================================================== */
  let EVENTOS = [];

  function desdeISO(dias) {
    if (!dias) return null;
    const d = new Date();
    d.setDate(d.getDate() - dias);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  function claveDia(iso) {
    const d = new Date(iso);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  const fmtFecha = iso => new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  function contarPor(lista, clave) {
    const m = new Map();
    lista.forEach(e => {
      const k = e[clave] || '—';
      m.set(k, (m.get(k) || 0) + 1);
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }

  async function cargarMetricas() {
    const dias = parseInt($('#rango').value, 10);
    const desde = desdeISO(dias);
    $('#kpis').innerHTML = '<p class="tabla-vacia">Cargando métricas…</p>';

    try {
      const todos = await KA_METRICAS.leer(desde);
      EVENTOS = (todos || []).filter(e => !desde || e.creado_en >= desde);
      pintarMetricas(dias);
    } catch (e) {
      $('#kpis').innerHTML = '';
      $('#aviso-modo').innerHTML =
        `<div class="aviso-modo aviso-modo--error">${ICO.info}
           <p><strong>No se pudieron leer las métricas.</strong> ${esc(explicar(e))}</p>
         </div>`;
    }
  }

  function pintarMetricas(dias) {
    const visitas    = EVENTOS.filter(e => e.tipo === 'visita');
    const vistasProp = EVENTOS.filter(e => e.tipo === 'ver_propiedad');
    const wa         = EVENTOS.filter(e => e.tipo === 'click_whatsapp');
    const forms      = EVENTOS.filter(e => e.tipo === 'envio_formulario');
    const unicos = new Set(EVENTOS.map(e => e.visitante_id)).size;

    // Conversión = personas que intentaron contactar sobre el total de personas.
    // Se cuentan visitantes distintos, no clics: una misma persona que toca
    // WhatsApp cinco veces sigue siendo una sola conversión.
    const contactaron = new Set(wa.concat(forms).map(e => e.visitante_id)).size;
    const conversion = unicos ? Math.round((contactaron / unicos) * 100) : 0;
    const enMovil = visitas.filter(e => e.dispositivo === 'movil').length;
    const pctMovil = visitas.length ? Math.round((enMovil / visitas.length) * 100) : 0;

    kpis([
      [ICO.gente, 'Visitantes únicos', unicos, 'personas distintas'],
      [ICO.ojo,   'Visitas de página', visitas.length, 'páginas abiertas'],
      [ICO.casa,  'Vistas de propiedad', vistasProp.length, 'fichas abiertas'],
      [ICO.wa,    'Clics en WhatsApp', wa.length, 'intentos de contacto'],
      [ICO.sobre, 'Consultas enviadas', forms.length, 'formularios completados'],
      [ICO.rayo,  'Conversión', conversion + '%', contactaron + ' de ' + unicos + ' personas contactaron'],
      [ICO.movil, 'Desde el celular', pctMovil + '%', 'del total de visitas']
    ]);

    grafico(visitas, dias);
    tablaPropiedades(vistasProp, wa);
    tablaSimple('#tabla-paginas', contarPor(visitas, 'pagina'), 'Página', 'Visitas');
    tablaSimple('#tabla-origen', contarPor(visitas, 'referencia'), 'Origen', 'Visitas');
    tablaEventos();

    $('#pie-info').textContent =
      `${EVENTOS.length} eventos en el período · actualizado ${new Date().toLocaleString('es-AR')}`;
  }

  function kpis(filas) {
    $('#kpis').innerHTML = filas.map(([ico, titulo, valor, nota]) => `
      <div class="kpi">
        <div class="kpi__cab">${ico}<span>${esc(titulo)}</span></div>
        <strong>${esc(valor)}</strong>
        <small>${esc(nota)}</small>
      </div>`).join('');
  }

  function grafico(visitas, dias) {
    const caja = $('#grafico');
    const cant = Math.min(dias || 30, 30) || 30;

    const porDia = new Map();
    visitas.forEach(e => {
      const k = claveDia(e.creado_en);
      porDia.set(k, (porDia.get(k) || 0) + 1);
    });

    const cols = [];
    for (let i = cant - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = claveDia(d.toISOString());
      cols.push({ k, etiqueta: d.getDate() + '/' + (d.getMonth() + 1), valor: porDia.get(k) || 0 });
    }

    if (!visitas.length) {
      caja.innerHTML = '<div class="grafico__vacio">Todavía no hay visitas registradas en este período.</div>';
      return;
    }

    const max = Math.max.apply(null, cols.map(c => c.valor).concat([1]));
    caja.innerHTML =
      '<div class="grafico__barras">' +
      cols.map(c => `
        <div class="grafico__col" data-valor="${c.etiqueta}: ${c.valor} ${c.valor === 1 ? 'visita' : 'visitas'}">
          <div class="grafico__barra" style="height:${Math.round((c.valor / max) * 165)}px"></div>
          <span>${esc(c.etiqueta)}</span>
        </div>`).join('') +
      '</div>';
  }

  function tablaPropiedades(vistas, wa) {
    const m = new Map();
    vistas.forEach(e => {
      const id = e.propiedad_id || '—';
      const r = m.get(id) || { id, titulo: e.titulo || '', vistas: 0, wa: 0 };
      r.vistas++;
      if (!r.titulo && e.titulo) r.titulo = e.titulo;
      m.set(id, r);
    });
    wa.forEach(e => {
      if (!e.propiedad_id) return;
      const r = m.get(e.propiedad_id) || { id: e.propiedad_id, titulo: '', vistas: 0, wa: 0 };
      r.wa++;
      m.set(e.propiedad_id, r);
    });

    // Si la propiedad sigue en el catálogo, se muestra su título actual
    m.forEach(r => {
      const p = CATALOGO.find(x => x.id === r.id);
      if (p) r.titulo = p.titulo;
    });

    const filas = Array.from(m.values()).sort((a, b) => b.vistas - a.vistas).slice(0, 20);
    const caja = $('#tabla-propiedades');

    if (!filas.length) {
      caja.innerHTML = '<div class="tabla-vacia">Todavía no hay fichas de propiedad visitadas.<br>' +
        'Cuando el catálogo empiece a recibir visitas, acá vas a ver cuáles son las más miradas.</div>';
      return;
    }

    const max = filas[0].vistas || 1;
    caja.innerHTML = `
      <table class="tabla">
        <thead><tr><th>Propiedad</th><th class="num">Vistas</th><th class="num">Clics WhatsApp</th></tr></thead>
        <tbody>${filas.map(f => `
          <tr>
            <td>
              ${esc(f.titulo || 'Sin título')}
              <span class="ref">${esc(f.id)}</span>
              <span class="barra-prop" style="width:${Math.round((f.vistas / max) * 100)}%"></span>
            </td>
            <td class="num">${f.vistas}</td>
            <td class="num">${f.wa}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function tablaSimple(sel, pares, encabezado, encabezadoNum) {
    const caja = $(sel);
    if (!pares.length) { caja.innerHTML = '<div class="tabla-vacia">Sin datos en este período.</div>'; return; }
    const max = pares[0][1] || 1;
    caja.innerHTML = `
      <table class="tabla">
        <thead><tr><th>${esc(encabezado)}</th><th class="num">${esc(encabezadoNum)}</th></tr></thead>
        <tbody>${pares.slice(0, 15).map(([k, v]) => `
          <tr>
            <td>${esc(k)}<span class="barra-prop" style="width:${Math.round((v / max) * 100)}%"></span></td>
            <td class="num">${v}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function tablaEventos() {
    const caja = $('#tabla-eventos');
    const filas = EVENTOS.slice().sort((a, b) => (a.creado_en < b.creado_en ? 1 : -1)).slice(0, 40);
    if (!filas.length) { caja.innerHTML = '<div class="tabla-vacia">Sin movimientos registrados.</div>'; return; }

    const pastilla = t => {
      const map = {
        visita: ['', 'Visita'],
        ver_propiedad: ['pastilla--ver', 'Vio propiedad'],
        click_propiedad: ['pastilla--ver', 'Clic en tarjeta'],
        click_whatsapp: ['pastilla--wa', 'WhatsApp'],
        click_telefono: ['pastilla--wa', 'Teléfono'],
        click_email: ['pastilla--wa', 'Email'],
        envio_formulario: ['pastilla--form', 'Consulta']
      };
      const [cls, txt] = map[t] || ['', t];
      return `<span class="pastilla ${cls}">${esc(txt)}</span>`;
    };

    caja.innerHTML = `
      <table class="tabla">
        <thead><tr><th>Cuándo</th><th>Qué pasó</th><th>Página</th><th>Origen</th><th>Dispositivo</th></tr></thead>
        <tbody>${filas.map(e => `
          <tr>
            <td class="ref">${esc(fmtFecha(e.creado_en))}</td>
            <td>${pastilla(e.tipo)}${e.propiedad_id ? `<span class="ref">${esc(e.propiedad_id)}</span>` : ''}</td>
            <td>${esc(e.pagina)}</td>
            <td>${esc(e.referencia)}</td>
            <td>${esc(e.dispositivo)}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  $('#rango').addEventListener('change', cargarMetricas);
  $('#btn-refrescar').addEventListener('click', cargarMetricas);

  $('#btn-csv').addEventListener('click', function () {
    if (!EVENTOS.length) { avisar('No hay eventos para exportar en este período.', 'error'); return; }
    const cols = ['creado_en', 'tipo', 'pagina', 'propiedad_id', 'titulo', 'referencia', 'dispositivo', 'visitante_id', 'sesion_id'];
    const escapar = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const csv = [cols.join(',')]
      .concat(EVENTOS.map(e => cols.map(c => escapar(e[c])).join(',')))
      .join('\r\n');

    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metricas-kevinamoroso-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  /* ==================================================================== */
  /*  Arranque                                                            */
  /* ==================================================================== */
  (async function iniciar() {
    if (KA_SB.auth.haySesion() && await KA_SB.auth.token()) mostrarPanel();
    else mostrarAcceso();
  })();
})();
