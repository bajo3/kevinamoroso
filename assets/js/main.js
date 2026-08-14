/* ==========================================================================
   main.js — Lógica del sitio (sin dependencias externas)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- Iconos */
  const ICO = {
    cama:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9v10M2 13h20v6M22 13v-3a2 2 0 0 0-2-2h-8v5"/><circle cx="7" cy="11" r="2"/></svg>',
    bano:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2M2 12h20v2a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-2ZM6 19l-1 2M18 19l1 2"/><path d="M7 5h2"/></svg>',
    auto:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M3 13l1.6-4.4A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.6L21 13v4h-2M3 13v4h2m-2-4h18"/><circle cx="7.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/></svg>',
    metros:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M3 9h4M3 15h4M9 3v4M15 3v4"/></svg>',
    lote:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16M9 20v-5h6v5"/></svg>',
    pin:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    corazon:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4l8.8 8.8 8.8-8.8a5.2 5.2 0 0 0 0-7.4Z"/></svg>',
    check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    estrella: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8L12 2Z"/></svg>',
    tel:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    mail:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>',
    reloj:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wa:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2s-.7 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>',
    ig:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>',
    fb:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.5 3 10.5 4.4 10.5 7v2H8.5v3h2v9H14v-9h2.6l.4-3H14Z"/></svg>',
    in:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.4H3.6V21h3.3V8.4ZM5.3 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3.3-1.8-4.9-4.2-4.9-1.9 0-2.8 1.1-3.2 1.8V8.4H9.6V21h3.4v-6.7c0-1.5.6-2.4 1.9-2.4s1.9.9 1.9 2.4V21h3.4v-7.4Z"/></svg>',
    lupa:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
    escudo:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 4 5.8v5.7c0 4.8 3.3 8.6 8 9.9 4.7-1.3 8-5.1 8-9.9V5.8l-8-3.3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    grafico:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V11M11 21V6M16 21v-7M21 21V9"/></svg>',
    camara:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/></svg>',
    doc:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    llave:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="5"/><path d="m11.5 11.5 8 8M17 17l2 2M15 15l2 2"/></svg>',
    // Categorías
    casa:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>',
    duplex:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l5-4 5 4v12M13 21V12l4-3 4 3v9M6 21v-4h4v4M16 21v-3h2v3"/></svg>',
    ph:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6l8-3v18M12 21h8V11l-8-3"/><path d="M7 10h2M7 14h2M15 13h2M15 17h2"/></svg>',
    depto:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>',
    quinta:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M4 20v-7l5-4 5 4v7"/><path d="M18 20v-5M18 15a3 3 0 0 0 0-6 3 3 0 0 0 0 6Z"/></svg>',
    terreno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18 8 6l5 7 3-4 5 9H3Z"/><path d="M3 21h18"/></svg>',
    local:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18l-1.2-4.2A1 1 0 0 0 18.8 4H5.2a1 1 0 0 0-1 .8L3 9Z"/><path d="M5 9v11h14V9M10 20v-6h4v6"/></svg>',
    campo:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18M3 21h18"/><path d="M6 17c0-3 1-6 1-6s1 3 1 6M11 17c0-4 1-8 1-8s1 4 1 8M16 17c0-3 1-6 1-6s1 3 1 6"/></svg>',
    asterisco: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor"><rect x="42" y="4" width="16" height="92"/><rect x="4" y="42" width="92" height="16"/><rect x="42" y="4" width="16" height="92" transform="rotate(45 50 50)"/><rect x="4" y="42" width="92" height="16" transform="rotate(45 50 50)"/></g></svg>'
  };

  /* --------------------------------------------------------------- Helpers */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const fmtPrecio = p =>
    (p.moneda === 'USD' ? 'U$D ' : '$ ') + p.precio.toLocaleString('es-AR');

  /* Acepta tanto una URL completa de Supabase Storage como el nombre de un
     archivo de assets/img/propiedades/. Sin foto, devuelve el marcador. */
  const SIN_FOTO = 'assets/img/sin-foto.svg';
  const imgSrc = n => {
    if (!n) return SIN_FOTO;
    const s = String(n);
    return (/^(https?:)?\/\//.test(s) || s.indexOf('assets/') === 0 || s.indexOf('data:') === 0)
      ? s
      : `assets/img/propiedades/${s}.jpg`;
  };
  const fotos = p => (p.imagenes && p.imagenes.length) ? p.imagenes : [null];

  const superficie = p => p.m2 > 0 ? p.m2 : p.m2Terreno;

  function urlPropiedad(id) { return `propiedad.html?id=${encodeURIComponent(id)}`; }

  /* ------------------------------------------------------------ Favoritos */
  const FAVS = {
    key: 'ka_favoritos',
    leer() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
    tiene(id) { return this.leer().indexOf(id) !== -1; },
    alternar(id) {
      const l = this.leer(); const i = l.indexOf(id);
      if (i === -1) l.push(id); else l.splice(i, 1);
      try { localStorage.setItem(this.key, JSON.stringify(l)); } catch (e) {}
      return i === -1;
    }
  };

  /* ------------------------------------------------- Tarjeta de propiedad */
  function tarjetaPropiedad(p) {
    const etiquetas = [];
    if (p.estado === 'vendida')  etiquetas.push('<span class="etiqueta etiqueta--tinta">Vendida</span>');
    if (p.estado === 'reservada') etiquetas.push('<span class="etiqueta etiqueta--tinta">Reservada</span>');
    if (p.destacada && p.estado === 'disponible') etiquetas.push('<span class="etiqueta etiqueta--oro">Destacada</span>');
    if (p.nueva && p.estado === 'disponible')     etiquetas.push('<span class="etiqueta">A estrenar</span>');

    const specs = [];
    if (p.dormitorios) specs.push(`<li>${ICO.cama}${p.dormitorios} dorm.</li>`);
    if (p.banos)       specs.push(`<li>${ICO.bano}${p.banos} baño${p.banos > 1 ? 's' : ''}</li>`);
    if (p.cocheras)    specs.push(`<li>${ICO.auto}${p.cocheras} coch.</li>`);
    if (p.m2)          specs.push(`<li>${ICO.metros}${p.m2} m²</li>`);
    else if (p.m2Terreno) specs.push(`<li>${ICO.lote}${p.tipo === 'campo' ? (p.m2Terreno / 10000) + ' ha' : p.m2Terreno + ' m²'}</li>`);

    const fav = FAVS.tiene(p.id);

    return `
      <article class="propiedad reveal">
        <div class="propiedad__media">
          <a href="${urlPropiedad(p.id)}" aria-label="Ver ${esc(p.titulo)}">
            <img src="${imgSrc(fotos(p)[0])}" alt="${esc(p.titulo)}" loading="lazy" width="1400" height="1050">
          </a>
          <div class="propiedad__etiquetas">${etiquetas.join('')}</div>
          <button class="propiedad__fav" type="button" data-fav="${esc(p.id)}"
                  aria-pressed="${fav}" aria-label="Guardar en favoritos" title="Guardar en favoritos">${ICO.corazon}</button>
        </div>
        <div class="propiedad__cuerpo">
          <p class="propiedad__precio">${fmtPrecio(p)} <small>${esc(p.id)}</small></p>
          <h3 class="propiedad__titulo"><a href="${urlPropiedad(p.id)}">${esc(p.titulo)}</a></h3>
          <p class="propiedad__ubicacion">${ICO.pin}${esc(nombreZona(p.zona))} · ${esc(nombreTipo(p.tipo))}</p>
          <ul class="propiedad__specs">${specs.join('')}</ul>
        </div>
      </article>`;
  }

  function pintarFavoritos(raiz) {
    $$('[data-fav]', raiz || document).forEach(b => {
      b.addEventListener('click', () => {
        const activo = FAVS.alternar(b.dataset.fav);
        b.setAttribute('aria-pressed', String(activo));
      });
    });
  }

  /* ----------------------------------------------------------- Header/nav */
  function initHeader() {
    const header = $('.header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('header--fijo', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const btn = $('.hamburguesa'), nav = $('.header__nav');
    if (btn && nav) {
      btn.addEventListener('click', () => {
        const abierto = nav.dataset.abierto === 'true';
        nav.dataset.abierto = String(!abierto);
        btn.setAttribute('aria-expanded', String(!abierto));
      });
      $$('a', nav).forEach(a => a.addEventListener('click', () => {
        nav.dataset.abierto = 'false';
        btn.setAttribute('aria-expanded', 'false');
      }));
    }
  }

  const menosMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ejecuta cuando la pantalla de carga ya se fue (o de inmediato si no hay). */
  function alEstarListo(fn) {
    if (!document.documentElement.classList.contains('cargando')) { fn(); return; }
    window.addEventListener('ka:cargado', fn, { once: true });
    setTimeout(fn, 7600); // red de seguridad
  }

  /* ------------------------------------------- Visibilidad en pantalla */
  /* Se resuelve midiendo la posición en vez de con IntersectionObserver: así
     el contenido nunca puede quedar invisible si el observador no dispara. */
  const vigilados = [];
  let vigilanciaArmada = false;

  function enVista(el, margen) {
    const r = el.getBoundingClientRect();
    const alto = window.innerHeight || document.documentElement.clientHeight;
    return r.top < alto - (margen || 0) && r.bottom > 0;
  }

  function revisarVigilados() {
    for (let i = vigilados.length - 1; i >= 0; i--) {
      const v = vigilados[i];
      if (enVista(v.el, v.margen)) { v.accion(v.el); vigilados.splice(i, 1); }
    }
  }

  function vigilar(el, accion, margen) {
    vigilados.push({ el, accion, margen: margen || 0 });
    if (!vigilanciaArmada) {
      vigilanciaArmada = true;
      const revisar = () => revisarVigilados();
      window.addEventListener('scroll', revisar, { passive: true });
      window.addEventListener('resize', revisar);
      // Varias pasadas iniciales: cubre imágenes que cambian el alto al cargar.
      [0, 120, 400, 1000, 2000].forEach(ms => setTimeout(revisar, ms));
    }
  }

  /* ------------------------------------------------------------- Reveal */
  function initReveal() {
    // Los títulos de sección se revelan con máscara; el resto, con desplazamiento.
    $$('.titulo-seccion, .hero h1').forEach(t => {
      if (!t.classList.contains('reveal') && !t.classList.contains('reveal-mask')) t.classList.add('reveal-mask');
    });

    const elems = $$('.reveal, .reveal-mask');
    if (menosMovimiento) { elems.forEach(e => e.classList.add('visible')); return; }

    elems.forEach(e => {
      if (e.classList.contains('reveal')) {
        // Escalona sólo entre hermanos de la misma grilla, no en toda la página.
        const hermanos = e.parentElement ? Array.from(e.parentElement.children).indexOf(e) : 0;
        e.style.transitionDelay = (Math.min(hermanos, 3) * 80) + 'ms';
      }
      vigilar(e, el => el.classList.add('visible'), 60);
    });
  }

  /* -------------------------------------------- Barra de progreso de lectura */
  function initProgresoScroll() {
    const barra = document.createElement('div');
    barra.className = 'progreso-scroll';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);

    const actualizar = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const p = alto > 0 ? Math.min(window.scrollY / alto, 1) : 0;
      barra.style.width = (p * 100).toFixed(2) + '%';
    };
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
  }

  /* ------------------------------------------------------ Volver arriba */
  function initSubir() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'subir';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: menosMovimiento ? 'auto' : 'smooth' });
    });
    const alternar = () => btn.classList.toggle('visible', window.scrollY > 700);
    alternar();
    window.addEventListener('scroll', alternar, { passive: true });
  }

  /* ---------------------------------------------------------- Contadores */
  /* Anima "U$D 92.000" o "12" desde cero, conservando prefijo y sufijo. */
  function initContadores() {
    const elems = $$('[data-contador]');
    if (!elems.length) return;

    const animar = el => {
      const partes = /^(\D*?)([\d.,]+)(.*)$/.exec(el.textContent.trim());
      if (!partes) return;
      const prefijo = partes[1], sufijo = partes[3];
      const destino = parseInt(partes[2].replace(/\D/g, ''), 10);
      if (!isFinite(destino)) return;

      if (menosMovimiento) return;
      const inicio = Date.now(), dur = 1400;
      const t = setInterval(() => {
        const avance = Math.min((Date.now() - inicio) / dur, 1);
        const suave = 1 - Math.pow(1 - avance, 4);           // easeOutQuart
        el.textContent = prefijo + Math.round(destino * suave).toLocaleString('es-AR') + sufijo;
        if (avance >= 1) clearInterval(t);
      }, 30);
    };

    elems.forEach(e => vigilar(e, animar, 80));
  }

  /* ------------------------------------------------------------ Parallax */
  function initParallax() {
    const fondo = $('.hero__fondo');
    const contenido = $('.hero__contenido');
    if (!fondo || menosMovimiento) return;

    let pendiente = false;
    const mover = () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) { pendiente = false; return; }
      fondo.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0) scale(1.06)';
      if (contenido) {
        contenido.style.opacity = Math.max(0, 1 - y / 520).toFixed(3);
        contenido.style.transform = 'translate3d(0,' + (y * 0.08).toFixed(1) + 'px,0)';
      }
      pendiente = false;
    };
    window.addEventListener('scroll', () => {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame ? requestAnimationFrame(mover) : setTimeout(mover, 16);
    }, { passive: true });
  }

  /* ----------------------------------------- Aparición de las imágenes */
  function initFadeImagenes(raiz) {
    const sel = '.propiedad__media img, .zona img, .galeria img, .perfil__foto img';
    $$(sel, raiz || document).forEach(img => {
      if (img.dataset.fade) return;
      img.dataset.fade = '1';
      if (menosMovimiento) { img.classList.add('cargada'); return; }
      const marcar = () => setTimeout(() => img.classList.add('cargada'), 20);
      if (img.complete && img.naturalWidth) marcar();
      else img.addEventListener('load', marcar, { once: true });
      img.addEventListener('error', () => img.classList.add('cargada'), { once: true });
    });
  }

  /* --------------------------------------------------------------- Cinta */
  /* Banda con el asterisco de marca. Se duplica el contenido para que el
     desplazamiento del 50 % quede perfectamente continuo. */
  function initCinta() {
    const cinta = $('[data-cinta]');
    if (!cinta) return;
    const frases = [
      'Compra y venta de casas', 'Venado Tuerto', 'Tasación sin cargo',
      'CENTURY 21 Domox SA', 'Acompañamiento de principio a fin', 'Kevin Amoroso'
    ];
    const bloque = frases.map(f => `<span class="cinta__item">${ICO.asterisco}${esc(f)}</span>`).join('');
    cinta.innerHTML = `<div class="cinta__pista">${bloque}${bloque}</div>`;
  }

  /* ---------------------------------------------------------------- FAQ */
  function initFaq() {
    const cont = $('[data-faq]');
    if (!cont) return;
    cont.innerHTML = FAQS.map((f, i) => `
      <div class="faq__item">
        <button class="faq__pregunta" type="button" aria-expanded="false" aria-controls="faq-r-${i}">
          <span>${esc(f.p)}</span><i aria-hidden="true">+</i>
        </button>
        <div class="faq__respuesta" id="faq-r-${i}"><div><p>${esc(f.r)}</p></div></div>
      </div>`).join('');
    $$('.faq__pregunta', cont).forEach(b => {
      b.addEventListener('click', () => {
        const abierto = b.getAttribute('aria-expanded') === 'true';
        $$('.faq__pregunta', cont).forEach(o => o.setAttribute('aria-expanded', 'false'));
        b.setAttribute('aria-expanded', String(!abierto));
      });
    });
  }

  /* ----------------------------------------------------- Datos de contacto */
  function initDatosMarca() {
    const a = CONFIG.asesor, o = CONFIG.oficina;
    $$('[data-wa]').forEach(el => {
      el.href = waLink(el.dataset.wa || `Hola ${a.nombre}, te escribo desde la web. Quiero hacerte una consulta.`);
    });
    // Sólo reemplaza el texto cuando es un marcador de posición («—» o vacío),
    // así los botones con rótulo propio («Llamar») conservan su texto.
    const marcador = el => { const t = el.textContent.trim(); return t === '' || t === '—'; };
    $$('[data-tel]').forEach(el => { el.href = 'tel:' + a.telefonoVisible.replace(/[^\d+]/g, ''); if (marcador(el)) el.textContent = a.telefonoVisible; });
    $$('[data-email]').forEach(el => { el.href = 'mailto:' + a.email; if (marcador(el)) el.textContent = a.email; });
    $$('[data-email-oficina]').forEach(el => { el.href = 'mailto:' + o.email; if (marcador(el)) el.textContent = o.email; });
    $$('[data-tel-oficina]').forEach(el => { el.href = 'tel:' + o.telefono.replace(/[^\d+]/g, ''); if (marcador(el)) el.textContent = o.telefono; });
    $$('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
    $$('[data-ig]').forEach(el => { el.href = a.instagram; });
    $$('[data-fb]').forEach(el => { el.href = a.facebook; });
    $$('[data-li]').forEach(el => { el.href = a.linkedin; });
    $$('[data-icono]').forEach(el => { el.innerHTML = ICO[el.dataset.icono] || ''; });
  }

  /* ------------------------------------------------------- Formularios */
  /* Sin backend: arma un mensaje de WhatsApp y ofrece copia por email.
     Para conectar un backend real, reemplazá el handler por un fetch(). */
  function initFormularios() {
    $$('form[data-form]').forEach(form => {
      form.addEventListener('submit', ev => {
        ev.preventDefault();
        const d = new FormData(form);
        const lineas = [];
        $$('[name]', form).forEach(campo => {
          if (campo.type === 'checkbox' && !campo.checked) return;
          const val = String(d.get(campo.name) || '').trim();
          if (!val) return;
          const et = form.querySelector(`label[for="${campo.id}"]`);
          const nombre = et ? et.textContent.replace('*', '').trim() : campo.name;
          lineas.push(`${nombre}: ${val}`);
        });
        const titulo = form.dataset.form;
        const mensaje = `*${titulo}* — web Kevin Amoroso\n\n${lineas.join('\n')}`;

        const aviso = $('.aviso-form', form);
        if (aviso) {
          aviso.hidden = false;
          aviso.innerHTML = `¡Listo! Abrimos WhatsApp con tu consulta cargada. Si no se abre, escribinos a
            <a href="mailto:${esc(CONFIG.asesor.email)}?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(lineas.join('\n'))}"><strong>${esc(CONFIG.asesor.email)}</strong></a>.`;
        }
        window.open(waLink(mensaje), '_blank', 'noopener');
      });
    });
  }

  /* ---------------------------------------------- Catálogo sin publicaciones */
  const selloSVG =
    '<svg class="catalogo-vacio__sello" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M50 6a44 44 0 1 0 44 44" fill="none" stroke="currentColor" stroke-width="7"/>' +
      '<text x="53" y="66" font-size="50" font-weight="700" fill="currentColor" text-anchor="middle">21</text>' +
    '</svg>';

  function bloqueCatalogoVacio(titulo, texto) {
    return `
      <div class="catalogo-vacio">
        ${selloSVG}
        <h3>${esc(titulo)}</h3>
        <p>${esc(texto)}</p>
        <div class="catalogo-vacio__acciones">
          <a class="btn" data-wa="Hola Kevin, quiero que me avises cuando publiques propiedades." href="#" target="_blank" rel="noopener">Avisame cuando publiques</a>
          <a class="btn btn--linea" href="vender.html">Quiero vender mi propiedad</a>
        </div>
      </div>`;
  }

  /* =======================================================================
     PÁGINA: INICIO
     ======================================================================= */
  function initInicio() {
    const cont = $('[data-destacadas]');
    if (!cont) return;

    if (!PROPIEDADES.length) {
      cont.innerHTML = bloqueCatalogoVacio(
        'Estamos preparando el catálogo',
        'Las publicaciones se están cargando en el sistema. Si buscás algo puntual, escribime y te aviso apenas entre una propiedad que encaje con lo que necesitás.'
      );
      initDatosMarca();
      return;
    }

    const destacadas = PROPIEDADES
      .filter(p => p.destacada && p.estado !== 'vendida')
      .slice(0, 4);
    cont.innerHTML = destacadas.map(tarjetaPropiedad).join('');
    pintarFavoritos(cont);

    // Categorías
    const cats = $('[data-categorias]');
    if (cats) {
      cats.innerHTML = TIPOS.map(t => {
        const n = PROPIEDADES.filter(p => p.tipo === t.id && p.estado !== 'vendida').length;
        return `<a class="categoria reveal" href="propiedades.html?tipo=${t.id}">
                  ${ICO[t.icono] || ICO.casa}<span>${esc(t.nombre)}</span>
                  <small>${n} ${n === 1 ? 'propiedad' : 'propiedades'}</small>
                </a>`;
      }).join('');
    }

    // Zonas
    const zonas = $('[data-zonas]');
    if (zonas) {
      zonas.innerHTML = ZONAS.map(z => {
        const n = PROPIEDADES.filter(p => p.zona === z.id && p.estado !== 'vendida').length;
        return `<a class="zona reveal" href="propiedades.html?zona=${z.id}">
                  <img src="${z.img}" alt="${esc(z.nombre)}, ${esc(CONFIG.ciudad)}" loading="lazy" width="800" height="1067">
                  <span class="zona__texto"><strong>${esc(z.nombre)}</strong><span>${n} ${n === 1 ? 'propiedad' : 'propiedades'}</span></span>
                </a>`;
      }).join('');
    }

    // Testimonios
    const tst = $('[data-testimonios]');
    if (tst) {
      tst.innerHTML = TESTIMONIOS.map(t => `
        <figure class="testimonio reveal">
          <div class="testimonio__estrellas" aria-label="5 de 5 estrellas">${ICO.estrella.repeat(5)}</div>
          <blockquote>“${esc(t.texto)}”</blockquote>
          <figcaption>
            <span class="avatar" aria-hidden="true">${esc(t.autor.charAt(0))}</span>
            <span><strong>${esc(t.autor)}</strong><span>${esc(t.detalle)}</span></span>
          </figcaption>
        </figure>`).join('');
    }

    // Métricas del hero y estadísticas, calculadas sobre el catálogo real
    const disponibles = PROPIEDADES.filter(p => p.estado === 'disponible');
    const casas = disponibles.filter(p => p.tipo === 'casa');
    const preciosCasa = casas.map(p => p.precio);
    const promedio = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    const setTxt = (sel, v) => {
      const e = $(sel);
      if (!e) return;
      e.textContent = v;
      e.setAttribute('data-contador', '');   // habilita la animación numérica
    };
    setTxt('[data-m-activas]', disponibles.length);
    setTxt('[data-m-zonas]', new Set(disponibles.map(p => p.zona)).size);
    if (preciosCasa.length) setTxt('[data-m-desde]', 'U$D ' + Math.min.apply(null, preciosCasa).toLocaleString('es-AR'));

    setTxt('[data-s-total]', disponibles.length);
    setTxt('[data-s-casas]', casas.length);
    if (preciosCasa.length) setTxt('[data-s-promedio]', 'U$D ' + promedio(preciosCasa).toLocaleString('es-AR'));
    setTxt('[data-s-estrenar]', disponibles.filter(p => p.nueva || p.antiguedad === 0).length);

    // Buscador rápido → propiedades.html
    const buscador = $('[data-buscador]');
    if (buscador) {
      const selTipo = $('#b-tipo', buscador), selZona = $('#b-zona', buscador);
      selTipo.innerHTML = '<option value="">Todos los tipos</option>' +
        TIPOS.map(t => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('');
      selZona.innerHTML = '<option value="">Todas las zonas</option>' +
        ZONAS.map(z => `<option value="${z.id}">${esc(z.nombre)}</option>`).join('');
      buscador.addEventListener('submit', ev => {
        ev.preventDefault();
        const q = new URLSearchParams();
        $$('select', buscador).forEach(s => { if (s.value) q.set(s.name, s.value); });
        window.location.href = 'propiedades.html' + (q.toString() ? '?' + q : '');
      });
    }
  }

  /* =======================================================================
     PÁGINA: LISTADO DE PROPIEDADES
     ======================================================================= */
  function initListado() {
    const grid = $('[data-grid]');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const form   = $('[data-filtros]');
    const conteo = $('[data-conteo]');
    const orden  = $('#f-orden');

    // Poblar selects
    $('#f-tipo').innerHTML = '<option value="">Todos</option>' +
      TIPOS.map(t => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('');
    $('#f-zona').innerHTML = '<option value="">Todas</option>' +
      ZONAS.map(z => `<option value="${z.id}">${esc(z.nombre)}</option>`).join('');

    // Valores iniciales desde la URL
    ['tipo', 'zona', 'min', 'max', 'dorm'].forEach(k => {
      const el = $('#f-' + k);
      if (el && params.get(k)) el.value = params.get(k);
    });

    let soloDisponibles = params.get('estado') !== 'todas';
    const chipDisp = $('[data-chip-disponibles]');
    if (chipDisp) {
      chipDisp.setAttribute('aria-pressed', String(soloDisponibles));
      chipDisp.addEventListener('click', () => {
        soloDisponibles = !soloDisponibles;
        chipDisp.setAttribute('aria-pressed', String(soloDisponibles));
        render();
      });
    }

    function filtrar() {
      const tipo = $('#f-tipo').value, zona = $('#f-zona').value;
      const min = parseFloat($('#f-min').value) || 0;
      const max = parseFloat($('#f-max').value) || Infinity;
      const dorm = parseInt($('#f-dorm').value, 10) || 0;

      let r = PROPIEDADES.filter(p =>
        (!tipo || p.tipo === tipo) &&
        (!zona || p.zona === zona) &&
        p.precio >= min && p.precio <= max &&
        (!dorm || p.dormitorios >= dorm) &&
        (!soloDisponibles || p.estado === 'disponible')
      );

      switch (orden.value) {
        case 'precio-asc':  r.sort((a, b) => a.precio - b.precio); break;
        case 'precio-desc': r.sort((a, b) => b.precio - a.precio); break;
        case 'sup-desc':    r.sort((a, b) => superficie(b) - superficie(a)); break;
        default:            r.sort((a, b) => (b.destacada - a.destacada) || (b.nueva - a.nueva));
      }
      return r;
    }

    function render() {
      const r = filtrar();
      conteo.innerHTML = r.length
        ? `<strong>${r.length}</strong> ${r.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`
        : '<strong>0</strong> resultados';
      grid.innerHTML = r.length
        ? r.map(tarjetaPropiedad).join('')
        : (PROPIEDADES.length
            // Hay catálogo, pero los filtros no devolvieron nada
            ? `<div class="sin-resultados" style="grid-column:1/-1">
                 <h3>No encontramos propiedades con esos filtros</h3>
                 <p>Probá ampliar el rango de precio o quitar alguna condición. También podés contarnos qué buscás y te avisamos cuando entre algo.</p>
                 <a class="btn" data-wa="Hola Kevin, no encontré lo que busco en la web. Te cuento qué necesito:" href="#" target="_blank" rel="noopener">Contarle a Kevin qué busco</a>
               </div>`
            // Todavía no hay ninguna publicación cargada
            : bloqueCatalogoVacio(
                'Estamos preparando el catálogo',
                'Las publicaciones se están cargando en el sistema. Contame qué estás buscando y te aviso apenas entre una propiedad que encaje.'
              ));
      grid.querySelectorAll('.reveal').forEach(e => e.classList.add('visible'));
      pintarFavoritos(grid);
      initFadeImagenes(grid);
      initDatosMarca();

      // Sincronizar URL sin recargar
      const q = new URLSearchParams();
      ['tipo', 'zona', 'min', 'max', 'dorm'].forEach(k => { const v = $('#f-' + k).value; if (v) q.set(k, v); });
      if (!soloDisponibles) q.set('estado', 'todas');
      history.replaceState(null, '', window.location.pathname + (q.toString() ? '?' + q : ''));
    }

    form.addEventListener('submit', ev => { ev.preventDefault(); render(); });
    $$('select, input', form).forEach(el => el.addEventListener('change', render));
    orden.addEventListener('change', render);

    const reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
      form.reset(); soloDisponibles = true;
      if (chipDisp) chipDisp.setAttribute('aria-pressed', 'true');
      render();
    });

    const btnMovil = $('[data-toggle-filtros]');
    if (btnMovil) btnMovil.addEventListener('click', () => {
      const f = $('.filtros');
      f.dataset.movil = f.dataset.movil === 'cerrado' ? 'abierto' : 'cerrado';
    });

    render();
  }

  /* =======================================================================
     PÁGINA: DETALLE DE PROPIEDAD
     ======================================================================= */
  function initDetalle() {
    const raiz = $('[data-detalle]');
    if (!raiz) return;

    const id = new URLSearchParams(window.location.search).get('id');
    const p = PROPIEDADES.find(x => x.id === id);

    if (!p) {
      raiz.innerHTML = `<div class="sin-resultados">
          <h3>No encontramos esa propiedad</h3>
          <p>Puede que se haya vendido o que el enlace esté desactualizado.</p>
          <a class="btn" href="propiedades.html">Ver todas las propiedades</a>
        </div>`;
      return;
    }

    document.title = `${p.titulo} — Kevin Amoroso | CENTURY 21 Domox`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.resumen);

    const migas = $('[data-migas]');
    if (migas) migas.innerHTML =
      `<a href="index.html">Inicio</a><span>/</span>
       <a href="propiedades.html">Propiedades</a><span>/</span>
       <a href="propiedades.html?zona=${p.zona}">${esc(nombreZona(p.zona))}</a><span>/</span>
       <span>${esc(p.id)}</span>`;

    // Galería
    const gal = $('[data-galeria]');
    const imgs = fotos(p);
    gal.innerHTML = `
      <div class="galeria__principal"><img src="${imgSrc(imgs[0])}" alt="${esc(p.titulo)}" data-lb="0" width="1400" height="1050"></div>
      <div class="galeria__lado">
        <div><img src="${imgSrc(imgs[1] || imgs[0])}" alt="${esc(p.titulo)} — ambiente 2" data-lb="1" loading="lazy" width="1400" height="1050"></div>
        <div>
          <img src="${imgSrc(imgs[2] || imgs[0])}" alt="${esc(p.titulo)} — ambiente 3" data-lb="2" loading="lazy" width="1400" height="1050">
          ${imgs.length > 3 ? `<button class="galeria__mas" type="button" data-lb="3">+${imgs.length - 3} fotos</button>` : ''}
        </div>
      </div>`;

    // Encabezado
    $('[data-titulo]').textContent = p.titulo;
    $('[data-ubicacion]').innerHTML = `${ICO.pin}${esc(p.direccion)} · ${esc(nombreZona(p.zona))}, ${esc(CONFIG.ciudad)}`;
    $('[data-precio]').textContent = fmtPrecio(p);
    $('[data-ref]').textContent = 'Referencia ' + p.id;

    const badge = $('[data-estado]');
    if (badge) {
      const mapa = { disponible: ['En venta', 'etiqueta--oro'], reservada: ['Reservada', 'etiqueta--tinta'], vendida: ['Vendida', 'etiqueta--tinta'] };
      const [txt, cls] = mapa[p.estado];
      badge.className = 'etiqueta ' + cls;
      badge.textContent = txt;
    }

    // Ficha técnica
    const ficha = [];
    if (p.m2)          ficha.push(['Superficie cubierta', p.m2 + ' m²']);
    if (p.m2Terreno)   ficha.push(['Terreno', p.tipo === 'campo' ? (p.m2Terreno / 10000) + ' ha' : p.m2Terreno + ' m²']);
    if (p.dormitorios) ficha.push(['Dormitorios', p.dormitorios]);
    if (p.banos)       ficha.push(['Baños', p.banos]);
    if (p.cocheras)    ficha.push(['Cocheras', p.cocheras]);
    ficha.push(['Tipo', nombreTipo(p.tipo)]);
    ficha.push(['Antigüedad', p.antiguedad === 0 ? 'A estrenar' : p.antiguedad + ' años']);
    $('[data-ficha]').innerHTML = ficha.map(([k, v]) =>
      `<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');

    const parrafos = p.descripcion.length ? p.descripcion : (p.resumen ? [p.resumen] : []);
    $('[data-descripcion]').innerHTML = parrafos.map(t => `<p>${esc(t)}</p>`).join('');
    $('[data-amenities]').innerHTML = p.amenities.map(a => `<li>${ICO.check}${esc(a)}</li>`).join('');
    $('[data-servicios]').innerHTML = p.servicios.map(a => `<li>${ICO.check}${esc(a)}</li>`).join('');

    // Los bloques sin contenido se ocultan en vez de quedar como títulos huérfanos
    [['[data-descripcion]', parrafos], ['[data-amenities]', p.amenities], ['[data-servicios]', p.servicios]]
      .forEach(([sel, datos]) => {
        const bloque = $(sel).closest('.detalle__bloque');
        if (bloque && !datos.length) bloque.hidden = true;
      });

    // Mapa
    const mapa = $('[data-mapa]');
    if (mapa) mapa.src = 'https://www.google.com/maps?q=' +
      encodeURIComponent(`${p.direccion}, ${CONFIG.ciudad}, Santa Fe, Argentina`) + '&output=embed';

    // CTA de contacto
    const msg = `Hola ${CONFIG.asesor.nombre}, me interesa la propiedad ${p.id} — ${p.titulo} (${fmtPrecio(p)}). ¿Podemos coordinar una visita?`;
    $$('[data-wa-prop]').forEach(el => { el.href = waLink(msg); });
    const oculto = $('[data-prop-oculta]');
    if (oculto) oculto.value = `${p.id} — ${p.titulo}`;

    // Similares
    const sim = $('[data-similares]');
    if (sim) {
      const r = PROPIEDADES
        .filter(x => x.id !== p.id && x.estado === 'disponible' && (x.zona === p.zona || x.tipo === p.tipo))
        .slice(0, 3);
      sim.innerHTML = r.map(tarjetaPropiedad).join('');
      sim.querySelectorAll('.reveal').forEach(e => e.classList.add('visible'));
      pintarFavoritos(sim);
    }

    initLightbox(imgs, p.titulo);
    initFadeImagenes();
    initDatosMarca();
  }

  /* ------------------------------------------------------------ Lightbox */
  function initLightbox(imgs, titulo) {
    const lb = $('[data-lightbox]');
    if (!lb) return;
    const img = $('img', lb), contador = $('.lightbox__contador', lb);
    let i = 0;

    const mostrar = n => {
      i = (n + imgs.length) % imgs.length;
      img.src = imgSrc(imgs[i]);
      img.alt = `${titulo} — foto ${i + 1}`;
      contador.textContent = `${i + 1} / ${imgs.length}`;
    };
    const abrir  = n => { mostrar(n); lb.hidden = false; document.body.style.overflow = 'hidden'; };
    const cerrar = () => { lb.hidden = true; document.body.style.overflow = ''; };

    $$('[data-lb]').forEach(el => el.addEventListener('click', () => abrir(parseInt(el.dataset.lb, 10))));
    $('.lightbox__cerrar', lb).addEventListener('click', cerrar);
    $('.lightbox__nav--prev', lb).addEventListener('click', () => mostrar(i - 1));
    $('.lightbox__nav--next', lb).addEventListener('click', () => mostrar(i + 1));
    lb.addEventListener('click', ev => { if (ev.target === lb) cerrar(); });
    document.addEventListener('keydown', ev => {
      if (lb.hidden) return;
      if (ev.key === 'Escape') cerrar();
      if (ev.key === 'ArrowLeft') mostrar(i - 1);
      if (ev.key === 'ArrowRight') mostrar(i + 1);
    });
  }

  /* -------------------------------------------------------- Video del hero */
  /* Se enciende sólo cuando conviene: en el celular pesa datos y compite con
     la carga de la página, así que ahí queda la foto de portada. */
  function initHeroVideo() {
    const video = $('[data-hero-video]');
    if (!video) return;

    const conexion = navigator.connection || {};
    const anchoOk  = window.innerWidth >= 900;
    const datosOk  = !conexion.saveData;
    const redOk    = !/^(slow-2g|2g|3g)$/.test(conexion.effectiveType || '');

    if (menosMovimiento || !anchoOk || !datosOk || !redOk) return;

    let encendido = false;
    const arrancar = () => {
      if (encendido) return;   // alEstarListo puede llamar dos veces (evento + red de seguridad)
      encendido = true;
      video.src = video.dataset.src;
      video.load();
      const reproducir = video.play();
      if (reproducir && reproducir.catch) reproducir.catch(() => {});
      video.addEventListener('playing', () => video.classList.add('visible'), { once: true });
    };

    // Espera a que se haya ido la pantalla de carga para no competir por ancho de banda
    alEstarListo(() => setTimeout(arrancar, 200));
  }

  /* ============================================================== Arranque */
  async function arrancarSitio() {
    // El catálogo vive en Supabase: se espera antes de dibujar para que las
    // secciones que dependen de él no parpadeen en vacío.
    if (typeof cargarPropiedades === 'function') {
      try { await cargarPropiedades(); } catch (e) {}
    }

    // Marca el documento cuando todavía no hay publicaciones cargadas, para que
    // las secciones que dependen del catálogo se oculten en vez de mostrar ceros.
    document.documentElement.classList.toggle('sin-propiedades', !PROPIEDADES.length);

    // Estructura y contenido
    initHeader();
    initDatosMarca();
    initInicio();
    initListado();
    initDetalle();
    initFaq();
    initFormularios();
    initCinta();

    // Interacción permanente
    initProgresoScroll();
    initSubir();
    initParallax();
    initFadeImagenes();
    initHeroVideo();

    // Animaciones de entrada: recién cuando se fue la pantalla de carga
    alEstarListo(function () {
      initReveal();
      initContadores();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    arrancarSitio().catch(e => console.error('[sitio] error al arrancar:', e));
  });
})();
