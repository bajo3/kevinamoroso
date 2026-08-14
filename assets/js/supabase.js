/* ==========================================================================
   supabase.js — Conexión con Supabase, sin librerías ni CDN

   Lo usan tres cosas:
     · el sitio público  → lee el catálogo de propiedades y registra métricas
     · el panel /admin   → inicia sesión, administra propiedades y sube fotos
     · analytics.js      → escribe los eventos

   La clave que está acá abajo es la **anon key**: es pública por diseño y las
   políticas de la base (RLS) definen qué puede hacer. Con ella, un visitante
   sólo puede leer propiedades publicadas e insertar eventos.
   La `service_role` NUNCA va en el navegador.
   ========================================================================== */
(function (global) {
  'use strict';

  const CONFIG = {
    url: 'https://rjbolwadldrfrsxwfnzm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYm9sd2FkbGRyZnJzeHdmbnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzExMjQsImV4cCI6MjEwMjIwNzEyNH0.YcqKLu40u8FRhmE3aMZRXU3ucs5tGWIsr3HbXfsRRlQ',
    bucket: 'propiedades'
  };

  const CLAVE_SESION = 'ka_sb_sesion';
  const MARGEN_REFRESCO = 60000;   // renueva el token un minuto antes de vencer

  /* ==================================================================== */
  /*  Sesión                                                              */
  /* ==================================================================== */
  let sesion = null;
  try {
    sesion = JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
  } catch (e) { sesion = null; }

  function guardarSesion(datos) {
    if (!datos || !datos.access_token) { limpiarSesion(); return null; }
    sesion = {
      access_token: datos.access_token,
      refresh_token: datos.refresh_token,
      expira_en: Date.now() + ((datos.expires_in || 3600) * 1000),
      usuario: datos.user ? { id: datos.user.id, email: datos.user.email } : (sesion && sesion.usuario) || null
    };
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion)); } catch (e) {}
    return sesion;
  }

  function limpiarSesion() {
    sesion = null;
    try { localStorage.removeItem(CLAVE_SESION); } catch (e) {}
  }

  /* ==================================================================== */
  /*  Pedidos                                                             */
  /* ==================================================================== */
  function cabeceras(extra, token) {
    return Object.assign({
      'apikey': CONFIG.anonKey,
      'Authorization': 'Bearer ' + (token || CONFIG.anonKey)
    }, extra || {});
  }

  /* Devuelve el mensaje más legible que traiga la respuesta de Supabase. */
  async function mensajeDeError(respuesta) {
    let cuerpo = '';
    try { cuerpo = await respuesta.text(); } catch (e) {}
    try {
      const j = JSON.parse(cuerpo);
      return j.message || j.error_description || j.msg || j.error || j.hint || cuerpo || respuesta.statusText;
    } catch (e) {
      return cuerpo || (respuesta.status + ' ' + respuesta.statusText);
    }
  }

  async function pedir(ruta, opciones) {
    const r = await fetch(CONFIG.url + ruta, opciones);
    if (!r.ok) {
      const err = new Error(await mensajeDeError(r));
      err.status = r.status;
      throw err;
    }
    if (r.status === 204) return null;
    const texto = await r.text();
    if (!texto) return null;
    try { return JSON.parse(texto); } catch (e) { return texto; }
  }

  /* ==================================================================== */
  /*  Autenticación                                                       */
  /* ==================================================================== */
  const auth = {
    get usuario() { return sesion && sesion.usuario; },
    haySesion() { return !!(sesion && sesion.refresh_token); },

    async ingresar(email, clave) {
      const datos = await pedir('/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: cabeceras({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: email, password: clave })
      });
      return guardarSesion(datos);
    },

    async refrescar() {
      if (!sesion || !sesion.refresh_token) return null;
      try {
        const datos = await pedir('/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: cabeceras({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ refresh_token: sesion.refresh_token })
        });
        return guardarSesion(datos);
      } catch (e) {
        limpiarSesion();
        return null;
      }
    },

    /* Token válido para el próximo pedido, renovándolo si hace falta. */
    async token() {
      if (!sesion) return null;
      if (Date.now() > (sesion.expira_en - MARGEN_REFRESCO)) {
        const nueva = await auth.refrescar();
        if (!nueva) return null;
      }
      return sesion.access_token;
    },

    async salir() {
      const t = sesion && sesion.access_token;
      limpiarSesion();
      if (!t) return;
      try {
        await fetch(CONFIG.url + '/auth/v1/logout', {
          method: 'POST', headers: cabeceras({}, t)
        });
      } catch (e) {}
    }
  };

  /* ==================================================================== */
  /*  Tablas (PostgREST)                                                  */
  /* ==================================================================== */
  async function rest(tabla, consulta, opciones) {
    const o = opciones || {};
    const token = o.publico ? null : await auth.token();
    return pedir('/rest/v1/' + tabla + (consulta || ''), {
      method: o.method || 'GET',
      headers: cabeceras(Object.assign(
        { 'Content-Type': 'application/json' },
        o.headers
      ), token),
      body: o.body ? JSON.stringify(o.body) : undefined,
      keepalive: !!o.keepalive
    });
  }

  const tabla = {
    /* Lectura pública: usa la anon key aunque haya sesión abierta. */
    async leerPublico(nombre, consulta) {
      return rest(nombre, consulta, { publico: true });
    },
    async leer(nombre, consulta) {
      return rest(nombre, consulta);
    },
    async insertar(nombre, filas) {
      return rest(nombre, '?select=*', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: filas
      });
    },
    async actualizar(nombre, consulta, cambios) {
      return rest(nombre, consulta + '&select=*', {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: cambios
      });
    },
    async borrar(nombre, consulta) {
      return rest(nombre, consulta, { method: 'DELETE' });
    }
  };

  /* ==================================================================== */
  /*  Storage                                                             */
  /* ==================================================================== */
  const EXTENSIONES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

  const storage = {
    urlPublica(ruta) {
      return CONFIG.url + '/storage/v1/object/public/' + CONFIG.bucket + '/' + ruta;
    },

    /* Devuelve la ruta interna a partir de una URL pública, o null si la URL
       no pertenece a este bucket (por ejemplo una foto vieja del repo). */
    rutaDeUrl(url) {
      const prefijo = CONFIG.url + '/storage/v1/object/public/' + CONFIG.bucket + '/';
      return String(url || '').indexOf(prefijo) === 0 ? String(url).slice(prefijo.length) : null;
    },

    async subir(archivo, carpeta) {
      const token = await auth.token();
      if (!token) throw new Error('La sesión venció. Volvé a entrar para subir fotos.');

      const ext = EXTENSIONES[archivo.type] ||
                  (archivo.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 5);
      const nombre = Date.now().toString(36) + '-' +
                     Math.random().toString(36).slice(2, 8) + '.' + ext;
      const ruta = (carpeta ? carpeta.replace(/[^a-zA-Z0-9._-]/g, '') + '/' : '') + nombre;

      const r = await fetch(CONFIG.url + '/storage/v1/object/' + CONFIG.bucket + '/' + ruta, {
        method: 'POST',
        headers: cabeceras({
          'Content-Type': archivo.type || 'image/jpeg',
          'x-upsert': 'true',
          'cache-control': '31536000'
        }, token),
        body: archivo
      });
      if (!r.ok) throw new Error(await mensajeDeError(r));
      return storage.urlPublica(ruta);
    },

    /* Borra del bucket las URLs que le correspondan. No falla si alguna no
       existe: el objetivo es no dejar fotos huérfanas, no bloquear el guardado. */
    async borrar(urls) {
      const rutas = (urls || []).map(storage.rutaDeUrl).filter(Boolean);
      if (!rutas.length) return;
      const token = await auth.token();
      if (!token) return;
      try {
        await fetch(CONFIG.url + '/storage/v1/object/' + CONFIG.bucket, {
          method: 'DELETE',
          headers: cabeceras({ 'Content-Type': 'application/json' }, token),
          body: JSON.stringify({ prefixes: rutas })
        });
      } catch (e) {
        console.warn('[storage] no se pudieron borrar fotos:', e.message);
      }
    }
  };

  /* ==================================================================== */
  global.KA_SB = {
    config: CONFIG,
    auth: auth,
    tabla: tabla,
    storage: storage,
    cabeceras: cabeceras
  };
})(window);
