/* ==========================================================================
   analytics.js — Registro de eventos del sitio

   Guarda visitas, vistas de propiedad, clics de WhatsApp y envíos de
   formulario. Tiene dos adaptadores intercambiables:

     'local'    → localStorage del navegador. Sirve para probar el panel,
                  pero cada visitante guarda sus datos en SU equipo, así que
                  el panel sólo muestra la actividad de quien lo abre.
     'supabase' → tabla `eventos` en Supabase. Es el modo real: todos los
                  visitantes escriben en la misma base y el panel ve el total.

   Para pasar a Supabase alcanza con completar las tres líneas de CONFIG_METRICAS
   (ver supabase/schema.sql para crear la tabla).
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------- Config */
  const CONFIG_METRICAS = {
    // Cambiar a 'supabase' cuando la base esté creada.
    adaptador: 'local',
    // PENDIENTE: pegar acá los datos del proyecto de Supabase.
    supabaseUrl: '',
    supabaseAnonKey: '',
    tabla: 'eventos',
    // Tope de eventos guardados en el navegador (sólo aplica al modo 'local').
    maximoLocal: 4000
  };

  const CLAVE_EVENTOS  = 'ka_eventos';
  const CLAVE_VISITANTE = 'ka_visitante';
  const CLAVE_SESION   = 'ka_sesion';

  /* ------------------------------------------------------------ Helpers */
  function uuid() {
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function guardado(almacen, clave) {
    try { return almacen.getItem(clave); } catch (e) { return null; }
  }
  function guardar(almacen, clave, valor) {
    try { almacen.setItem(clave, valor); } catch (e) {}
  }

  function idVisitante() {
    let v = guardado(localStorage, CLAVE_VISITANTE);
    if (!v) { v = uuid(); guardar(localStorage, CLAVE_VISITANTE, v); }
    return v;
  }
  function idSesion() {
    let s = guardado(sessionStorage, CLAVE_SESION);
    if (!s) { s = uuid(); guardar(sessionStorage, CLAVE_SESION, s); }
    return s;
  }

  function dispositivo() {
    const a = global.innerWidth;
    if (a < 768) return 'movil';
    if (a < 1100) return 'tablet';
    return 'escritorio';
  }

  function paginaActual() {
    const p = location.pathname.replace(/\/$/, '');
    return (p.split('/').pop() || 'index.html');
  }

  /* Referencia externa: de dónde vino la visita (Google, Instagram, directo…) */
  function referencia() {
    const utm = new URLSearchParams(location.search).get('utm_source');
    if (utm) return utm.slice(0, 80);
    const r = document.referrer;
    if (!r) return 'directo';
    try {
      const h = new URL(r).hostname.replace(/^www\./, '');
      return h === location.hostname ? 'interno' : h.slice(0, 80);
    } catch (e) { return 'desconocido'; }
  }

  /* --------------------------------------------------------- Adaptadores */
  const adaptadorLocal = {
    nombre: 'local',
    async escribir(evento) {
      const lista = this._leerCrudo();
      lista.push(evento);
      if (lista.length > CONFIG_METRICAS.maximoLocal) {
        lista.splice(0, lista.length - CONFIG_METRICAS.maximoLocal);
      }
      guardar(localStorage, CLAVE_EVENTOS, JSON.stringify(lista));
    },
    async leer() { return this._leerCrudo(); },
    async borrar() { try { localStorage.removeItem(CLAVE_EVENTOS); } catch (e) {} },
    _leerCrudo() {
      try { return JSON.parse(guardado(localStorage, CLAVE_EVENTOS)) || []; }
      catch (e) { return []; }
    }
  };

  const adaptadorSupabase = {
    nombre: 'supabase',
    _url(sufijo) {
      return CONFIG_METRICAS.supabaseUrl.replace(/\/$/, '') +
             '/rest/v1/' + CONFIG_METRICAS.tabla + (sufijo || '');
    },
    _cabeceras(extra) {
      return Object.assign({
        'apikey': CONFIG_METRICAS.supabaseAnonKey,
        'Authorization': 'Bearer ' + CONFIG_METRICAS.supabaseAnonKey,
        'Content-Type': 'application/json'
      }, extra || {});
    },
    async escribir(evento) {
      // keepalive permite que el pedido sobreviva a la navegación del clic.
      await fetch(this._url(), {
        method: 'POST',
        headers: this._cabeceras({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify(evento),
        keepalive: true
      });
    },
    async leer(desde) {
      const q = '?select=*&order=creado_en.desc&limit=5000' +
                (desde ? '&creado_en=gte.' + encodeURIComponent(desde) : '');
      const r = await fetch(this._url(q), { headers: this._cabeceras() });
      if (!r.ok) throw new Error('Supabase respondió ' + r.status + ' ' + r.statusText);
      return r.json();
    },
    async borrar() {
      throw new Error('El borrado en Supabase se hace desde el panel de Supabase.');
    }
  };

  function adaptador() {
    const usarSupabase = CONFIG_METRICAS.adaptador === 'supabase' &&
                         CONFIG_METRICAS.supabaseUrl && CONFIG_METRICAS.supabaseAnonKey;
    return usarSupabase ? adaptadorSupabase : adaptadorLocal;
  }

  /* ------------------------------------------------------------- API */
  const KA_METRICAS = {
    config: CONFIG_METRICAS,

    get modo() { return adaptador().nombre; },
    /* true cuando se pidió Supabase pero faltan las credenciales */
    get supabasePendiente() {
      return CONFIG_METRICAS.adaptador === 'supabase' && adaptador().nombre === 'local';
    },

    registrar(tipo, datos) {
      const evento = Object.assign({
        tipo: tipo,
        creado_en: new Date().toISOString(),
        pagina: paginaActual(),
        referencia: referencia(),
        visitante_id: idVisitante(),
        sesion_id: idSesion(),
        dispositivo: dispositivo(),
        propiedad_id: null,
        titulo: null
      }, datos || {});

      try {
        const r = adaptador().escribir(evento);
        if (r && r.catch) r.catch(e => console.warn('[métricas] no se pudo registrar:', e.message));
      } catch (e) {
        console.warn('[métricas] no se pudo registrar:', e.message);
      }
      return evento;
    },

    leer(desde) { return Promise.resolve(adaptador().leer(desde)); },
    borrar()    { return Promise.resolve(adaptador().borrar()); },
    visitante() { return idVisitante(); }
  };

  global.KA_METRICAS = KA_METRICAS;

  /* ================================================================
     Registro automático
     ================================================================ */
  const esAdmin = /admin/.test(paginaActual());

  function idPropiedadDeUrl() {
    return new URLSearchParams(location.search).get('id');
  }

  function arrancar() {
    if (esAdmin) return;   // el panel no se cuenta a sí mismo

    KA_METRICAS.registrar('visita');

    const idProp = idPropiedadDeUrl();
    if (idProp && paginaActual().indexOf('propiedad.html') === 0) {
      // Se espera un instante a que main.js escriba el título de la propiedad.
      setTimeout(() => {
        KA_METRICAS.registrar('ver_propiedad', {
          propiedad_id: idProp,
          titulo: (document.title || '').split(' — ')[0].slice(0, 160)
        });
      }, 350);
    }
  }

  /* Clics: se delega en el documento para que también alcance a las
     tarjetas y botones que main.js dibuja después. */
  document.addEventListener('click', function (ev) {
    if (esAdmin) return;
    const a = ev.target.closest && ev.target.closest('a, button');
    if (!a) return;

    const href = a.getAttribute && a.getAttribute('href') || '';
    const idProp = idPropiedadDeUrl();

    if (a.hasAttribute('data-wa') || a.hasAttribute('data-wa-prop') ||
        a.classList.contains('wa-flotante') || href.indexOf('wa.me') !== -1) {
      KA_METRICAS.registrar('click_whatsapp', {
        propiedad_id: idProp,
        titulo: a.getAttribute('aria-label') || (a.textContent || '').trim().slice(0, 80)
      });
      return;
    }

    if (a.hasAttribute('data-tel') || href.indexOf('tel:') === 0) {
      KA_METRICAS.registrar('click_telefono', { propiedad_id: idProp });
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      KA_METRICAS.registrar('click_email', { propiedad_id: idProp });
      return;
    }

    // Clic en una tarjeta del catálogo
    const tarjeta = a.closest('.propiedad');
    if (tarjeta && href.indexOf('propiedad.html') !== -1) {
      const m = /[?&]id=([^&]+)/.exec(href);
      KA_METRICAS.registrar('click_propiedad', {
        propiedad_id: m ? decodeURIComponent(m[1]) : null,
        titulo: (tarjeta.querySelector('.propiedad__titulo') || {}).textContent || null
      });
    }
  }, true);

  document.addEventListener('submit', function (ev) {
    if (esAdmin) return;
    const form = ev.target;
    if (!form || !form.hasAttribute('data-form')) return;
    KA_METRICAS.registrar('envio_formulario', {
      propiedad_id: idPropiedadDeUrl(),
      titulo: form.getAttribute('data-form')
    });
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})(window);
