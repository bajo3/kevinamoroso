/* ==========================================================================
   admin.js — Panel de métricas

   AVISO SOBRE EL ACCESO
   El usuario y la contraseña se comparan en el navegador. Eso mantiene el
   panel fuera de la vista de un visitante casual, pero NO es seguridad: el
   código de esta página es público y cualquiera puede leerlo. Es provisorio
   hasta conectar la autenticación de Supabase.
   ========================================================================== */
(function () {
  'use strict';

  /* Credenciales provisorias (SHA-256 de "admin" en ambos casos). */
  const ACCESO = {
    usuario: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    clave:   '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
  };
  const CLAVE_SESION_ADMIN = 'ka_admin_ok';

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
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5M12 7.6h.01"/></svg>'
  };

  /* ==================================================================== */
  /*  Acceso                                                              */
  /* ==================================================================== */
  async function hash(texto) {
    if (window.crypto && window.crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Sin crypto.subtle (contexto no seguro): comparación directa de respaldo.
    return texto === 'admin' ? ACCESO.usuario : 'sin-hash:' + texto;
  }

  function mostrarPanel() {
    $('#acceso').style.display = 'none';
    $('#panel').classList.add('activo');
    cargar();
  }

  $('#form-acceso').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    const err = $('#acceso-error');
    const u = await hash($('#usuario').value.trim());
    const c = await hash($('#clave').value);

    if (u === ACCESO.usuario && c === ACCESO.clave) {
      try { sessionStorage.setItem(CLAVE_SESION_ADMIN, '1'); } catch (e) {}
      err.hidden = true;
      mostrarPanel();
    } else {
      err.hidden = false;
      err.textContent = 'Usuario o contraseña incorrectos.';
      $('#clave').value = '';
      $('#clave').focus();
    }
  });

  $('#btn-salir').addEventListener('click', function () {
    try { sessionStorage.removeItem(CLAVE_SESION_ADMIN); } catch (e) {}
    location.reload();
  });

  /* ==================================================================== */
  /*  Datos                                                               */
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

  async function cargar() {
    const dias = parseInt($('#rango').value, 10);
    const desde = desdeISO(dias);

    pintarAviso();
    try {
      const todos = await KA_METRICAS.leer(desde);
      EVENTOS = (todos || []).filter(e => !desde || e.creado_en >= desde);
      pintarTodo(dias);
    } catch (e) {
      $('#aviso-modo').innerHTML =
        `<div class="aviso-modo aviso-modo--error">${ICO.info}
           <p><strong>No se pudieron leer las métricas.</strong> ${esc(e.message)}</p>
         </div>`;
    }
  }

  function pintarAviso() {
    const caja = $('#aviso-modo');
    if (KA_METRICAS.supabasePendiente) {
      caja.innerHTML =
        `<div class="aviso-modo aviso-modo--error">${ICO.info}
          <p><strong>Falta configurar Supabase.</strong> El adaptador está en <code>supabase</code>
             pero no hay <code>supabaseUrl</code> ni <code>supabaseAnonKey</code> en
             <code>assets/js/analytics.js</code>. Mientras tanto se muestran los datos locales.</p>
         </div>`;
      return;
    }
    if (KA_METRICAS.modo === 'local') {
      caja.innerHTML =
        `<div class="aviso-modo">${ICO.info}
          <p><strong>Modo local.</strong> Los eventos se guardan en el navegador de cada visitante,
             así que acá sólo ves la actividad de <em>este</em> equipo. Para medir a todos los
             visitantes hay que crear la tabla de Supabase (<code>supabase/schema.sql</code>) y
             completar las credenciales en <code>assets/js/analytics.js</code>.</p>
         </div>`;
    } else {
      caja.innerHTML =
        `<div class="aviso-modo">${ICO.info}
          <p><strong>Conectado a Supabase.</strong> Los datos incluyen a todos los visitantes del sitio.</p>
         </div>`;
    }
  }

  /* ==================================================================== */
  /*  Render                                                              */
  /* ==================================================================== */
  function pintarTodo(dias) {
    const visitas   = EVENTOS.filter(e => e.tipo === 'visita');
    const vistasProp = EVENTOS.filter(e => e.tipo === 'ver_propiedad');
    const wa        = EVENTOS.filter(e => e.tipo === 'click_whatsapp');
    const forms     = EVENTOS.filter(e => e.tipo === 'envio_formulario');
    const unicos = new Set(EVENTOS.map(e => e.visitante_id)).size;

    // Conversión = personas que intentaron contactar sobre el total de personas.
    // Se cuentan visitantes distintos, no clics: una misma persona que toca
    // WhatsApp cinco veces sigue siendo una sola conversión.
    const contactaron = new Set(
      wa.concat(forms).map(e => e.visitante_id)
    ).size;
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
      `${EVENTOS.length} eventos en el período · modo ${KA_METRICAS.modo} · ` +
      `actualizado ${new Date().toLocaleString('es-AR')}`;
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

    const max = Math.max.apply(null, cols.map(c => c.valor).concat([1]));
    if (!visitas.length) {
      caja.innerHTML = '<div class="grafico__vacio">Todavía no hay visitas registradas en este período.</div>';
      return;
    }

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

    const filas = Array.from(m.values()).sort((a, b) => b.vistas - a.vistas).slice(0, 20);
    const caja = $('#tabla-propiedades');

    if (!filas.length) {
      caja.innerHTML = '<div class="tabla-vacia">Todavía no hay fichas de propiedad visitadas.<br>' +
        'Cuando cargues publicaciones, acá vas a ver cuáles son las más miradas.</div>';
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

  /* ==================================================================== */
  /*  Acciones                                                            */
  /* ==================================================================== */
  $('#rango').addEventListener('change', cargar);
  $('#btn-refrescar').addEventListener('click', cargar);

  $('#btn-csv').addEventListener('click', function () {
    if (!EVENTOS.length) { alert('No hay eventos para exportar en este período.'); return; }
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

  $('#btn-borrar').addEventListener('click', async function () {
    if (!confirm('Se borran los eventos guardados en ESTE navegador. ¿Continuar?')) return;
    try { await KA_METRICAS.borrar(); cargar(); }
    catch (e) { alert(e.message); }
  });

  /* Sesión ya iniciada en esta pestaña */
  try {
    if (sessionStorage.getItem(CLAVE_SESION_ADMIN) === '1') mostrarPanel();
    else $('#usuario').focus();
  } catch (e) {}
})();
