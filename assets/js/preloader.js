/* ==========================================================================
   preloader.js — Pantalla de carga con anillo de progreso + transición de página
   Se carga al inicio del <body>, de forma sincrónica, para que no haya
   destello de contenido sin estilar. No depende de data.js ni de main.js.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Primera visita de la sesión → carga completa. Navegación interna → carga breve. */
  var primeraVez = true;
  try { primeraVez = !sessionStorage.getItem('ka_precarga'); sessionStorage.setItem('ka_precarga', '1'); } catch (e) {}

  var DURACION_MIN = reducido ? 0 : (primeraVez ? 1200 : 480);
  /* Tope duro: pase lo que pase con las imágenes, la pantalla no retiene al
     usuario más que esto. El resto de las fotos siguen cargando por detrás. */
  var DURACION_MAX = reducido ? 0 : (primeraVez ? 2600 : 900);
  var RADIO = 54;
  var PERIMETRO = 2 * Math.PI * RADIO;   // 339.29

  /* ------------------------------------------------------------- Markup */
  var overlay = document.createElement('div');
  overlay.className = 'precarga';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-label', 'Cargando el sitio');
  overlay.innerHTML =
    '<div class="precarga__caja">' +
      '<div class="precarga__anillo">' +
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
          '<circle class="precarga__pista" cx="60" cy="60" r="' + RADIO + '"/>' +
          '<circle class="precarga__arco" cx="60" cy="60" r="' + RADIO + '"/>' +
        '</svg>' +
        '<div class="precarga__centro">' +
          '<svg class="precarga__sello" viewBox="0 0 100 100" aria-hidden="true">' +
            '<path d="M50 6a44 44 0 1 0 44 44" fill="none" stroke="currentColor" stroke-width="7"/>' +
            '<text x="53" y="66" font-size="50" font-weight="700" fill="currentColor" text-anchor="middle">21</text>' +
          '</svg>' +
          '<p class="precarga__pct"><b>0</b><span>%</span></p>' +
        '</div>' +
      '</div>' +
      '<div class="precarga__marca">' +
        '<span class="precarga__c21">CENTURY 21</span>' +
        '<span class="precarga__sub">Domox SA · Kevin Amoroso</span>' +
      '</div>' +
      '<p class="precarga__estado">Cargando<b>.</b><b>.</b><b>.</b></p>' +
    '</div>';

  var transicion = document.createElement('div');
  transicion.className = 'transicion';
  transicion.setAttribute('aria-hidden', 'true');

  html.classList.add('cargando');
  (document.body || html).appendChild(overlay);
  (document.body || html).appendChild(transicion);

  var arco = overlay.querySelector('.precarga__arco');
  var numero = overlay.querySelector('.precarga__pct b');
  arco.style.strokeDashoffset = PERIMETRO;

  /* ---------------------------------------------------------- Progreso */
  var inicio = Date.now();
  var actual = 0;          // lo que se ve
  var terminado = false;
  var forzarFinal = false;

  function progresoReal() {
    // Mezcla tres señales: estado del documento, imágenes resueltas y tiempo.
    var doc = document.readyState === 'complete' ? 1 : (document.readyState === 'interactive' ? .55 : .2);

    var imgs = document.images, total = imgs.length, listas = 0;
    for (var i = 0; i < total; i++) if (imgs[i].complete) listas++;
    var img = total ? listas / total : 1;

    var tiempo = Math.min((Date.now() - inicio) / (DURACION_MAX || 1), 1);

    // El tiempo pesa lo suficiente como para que el anillo nunca parezca trabado.
    var p = (doc * 0.25) + (img * 0.35) + (tiempo * 0.40);
    return forzarFinal ? 1 : Math.min(p, 0.95);   // se reserva el tramo final para el cierre
  }

  function pintar(p) {
    var pct = Math.round(p * 100);
    numero.textContent = pct;
    arco.style.strokeDashoffset = PERIMETRO * (1 - p);
    overlay.setAttribute('aria-label', 'Cargando el sitio: ' + pct + ' por ciento');
  }

  /* setInterval en lugar de requestAnimationFrame: sigue avanzando aunque la
     pestaña no esté componiendo cuadros, así la pantalla nunca queda trabada. */
  var tick = setInterval(function () {
    var objetivo = progresoReal();
    actual += (objetivo - actual) * 0.18;
    if (objetivo - actual < 0.004) actual = objetivo;
    pintar(actual);

    if (forzarFinal && actual > 0.995) { pintar(1); cerrar(); }
  }, 30);

  function completar() {
    if (terminado) return;
    var espera = Math.max(0, DURACION_MIN - (Date.now() - inicio));
    setTimeout(function () { forzarFinal = true; }, espera);
  }

  function cerrar() {
    if (terminado) return;
    terminado = true;
    clearInterval(tick);
    pintar(1);
    setTimeout(function () {
      overlay.classList.add('oculta');
      html.classList.remove('cargando');
      html.classList.add('listo');
      window.dispatchEvent(new CustomEvent('ka:cargado'));
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 800);
    }, 260);
  }

  /* Se cierra con lo que ocurra primero: la carga real o el tope de tiempo. */
  if (document.readyState === 'complete') completar();
  else window.addEventListener('load', completar);
  setTimeout(completar, DURACION_MAX);

  /* Red de seguridad final por si algo falla en el camino. */
  setTimeout(function () { forzarFinal = true; setTimeout(cerrar, 400); }, 6000);

  /* ------------------------------------------- Transición entre páginas */
  if (!reducido) {
    document.addEventListener('click', function (ev) {
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      var a = ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;

      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(mailto:|tel:|https?:\/\/wa\.me|javascript:)/i.test(href)) return;
      if (a.origin && a.origin !== window.location.origin) return;
      // Mismo documento, sólo cambia el hash
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;

      ev.preventDefault();
      html.classList.add('saliendo');
      setTimeout(function () { window.location.href = a.href; }, 320);
    });
  }

  /* Al volver con el botón "atrás" (bfcache) el overlay debe estar limpio. */
  window.addEventListener('pageshow', function (ev) {
    html.classList.remove('saliendo');
    if (ev.persisted) { html.classList.remove('cargando'); overlay.classList.add('oculta'); }
  });
})();
