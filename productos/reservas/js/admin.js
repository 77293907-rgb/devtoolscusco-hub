/* =========================================================
   admin.js — Lógica del Panel de Administración (COMPLETO)
   ========================================================= */

let rolActual = ''; 

document.addEventListener('DOMContentLoaded', () => {
  const sesion = localStorage.getItem('rinconcito_sesion');
  if (sesion) {
    iniciarSesion(sesion);
  }
});

/* =========================================================
   1. LOGIN Y SESIÓN
   ========================================================= */
function loginRapido(rol) {
  localStorage.setItem('rinconcito_sesion', rol);
  iniciarSesion(rol);
}

function iniciarSesion(rol) {
  rolActual = rol;
  
  document.getElementById('pantalla-login').classList.add('hidden');
  document.getElementById('app-panel').classList.remove('hidden');

  const nombre = rol === 'admin' ? 'Dueño (Admin)' : 'Vendedor';
  const correo = rol === 'admin' ? 'admin@rinconcito.com' : 'ventas@rinconcito.com';
  const inicial = rol === 'admin' ? 'A' : 'V';

  document.getElementById('rol-usuario').textContent = nombre;
  document.getElementById('nombre-usuario').textContent = nombre;
  document.getElementById('correo-usuario').textContent = correo;
  document.getElementById('inicial-usuario').textContent = inicial;

  // Lógica de exclusividad
  const navResumen = document.getElementById('nav-resumen');
  
  if (rol === 'admin') {
    navResumen.classList.remove('hidden');
    cambiarVista('resumen');
  } else {
    navResumen.classList.add('hidden');
    document.getElementById('vista-resumen').classList.add('hidden');
    cambiarVista('platos'); 
  }

  actualizarKPIs();
  renderizarTablaPlatos();
  renderizarTablaReservas();
}

function cerrarSesion() {
  localStorage.removeItem('rinconcito_sesion');
  location.reload();
}

/* =========================================================
   2. NAVEGACIÓN
   ========================================================= */
function cambiarVista(vista) {
  document.getElementById('vista-resumen').classList.add('hidden');
  document.getElementById('vista-platos').classList.add('hidden');
  document.getElementById('vista-reservas').classList.add('hidden');
  
  const botones = ['nav-resumen', 'nav-platos', 'nav-reservas'];
  botones.forEach(id => {
    const btn = document.getElementById(id);
    if(btn) btn.className = "flex items-center gap-3 px-4 py-3 rounded-lg text-cal-100 hover:bg-white/5 transition-colors";
  });

  if (vista === 'resumen') {
    if (rolActual !== 'admin') return cambiarVista('platos'); 
    document.getElementById('vista-resumen').classList.remove('hidden');
    document.getElementById('nav-resumen').className = "flex items-center gap-3 px-4 py-3 rounded-lg bg-adobe-500/10 text-maiz-500 border border-adobe-500/20 font-medium transition-colors";
    document.getElementById('titulo-seccion').textContent = "Resumen General";
    actualizarKPIs();
  } 
  else if (vista === 'platos') {
    document.getElementById('vista-platos').classList.remove('hidden');
    document.getElementById('nav-platos').className = "flex items-center gap-3 px-4 py-3 rounded-lg bg-adobe-500/10 text-maiz-500 border border-adobe-500/20 font-medium transition-colors";
    document.getElementById('titulo-seccion').textContent = "Menú de Platos";
  } 
  else if (vista === 'reservas') {
    document.getElementById('vista-reservas').classList.remove('hidden');
    document.getElementById('nav-reservas').className = "flex items-center gap-3 px-4 py-3 rounded-lg bg-adobe-500/10 text-maiz-500 border border-adobe-500/20 font-medium transition-colors";
    document.getElementById('titulo-seccion').textContent = "Historial de Reservas";
  }
}

/* =========================================================
   3. RENDERIZADO DE DATOS (KPIs Y TABLAS)
   ========================================================= */
function actualizarKPIs() {
  const platos = JSON.parse(localStorage.getItem('rinconcito_platos')) || [];
  const reservas = JSON.parse(localStorage.getItem('rinconcito_reservas')) || [];

  const elPlatos = document.getElementById('kpi-platos');
  const elReservas = document.getElementById('kpi-reservas');
  const elIngresos = document.getElementById('kpi-ingresos');

  if(elPlatos) elPlatos.textContent = platos.length;
  if(elReservas) elReservas.textContent = reservas.length;
  if(elIngresos) elIngresos.textContent = `S/ ${(reservas.length * 35).toFixed(2)}`;
}


function renderizarTablaPlatos() {
  const tbody = document.getElementById('tabla-platos-body');
  if (!tbody) return;
  
  let platos = [];
  try {
    const data = localStorage.getItem('rinconcito_platos');
    platos = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer los platos, reiniciando...", error);
    platos = []; // Si hay error, lo dejamos vacío para que no rompa
    localStorage.removeItem('rinconcito_platos'); // Limpiamos la basura
  }

  tbody.innerHTML = '';

  if (platos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">No hay platos registrados.</td></tr>';
    return;
  }

  platos.forEach(plato => {
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-50 hover:bg-gray-50 transition-colors";
    
    const btnEliminar = rolActual === 'admin' 
      ? `<button onclick="eliminarPlato('${plato.id}')" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar">
           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
         </button>`
      : `<span class="text-xs text-gray-400 italic">Restringido</span>`;

    tr.innerHTML = `
      <td class="p-4 flex items-center gap-3">
        <img src="${plato.imagen}" class="h-10 w-10 rounded-md object-cover border border-gray-200" alt="${plato.nombre}">
        <span class="font-medium text-ink-900">${plato.nombre}</span>
      </td>
      <td class="p-4 text-sm text-gray-500">${plato.categoria}</td>
      <td class="p-4 text-sm font-bold text-ink-900">S/ ${plato.precio.toFixed(2)}</td>
      <td class="p-4 text-right">${btnEliminar}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderizarTablaReservas() {
  const tbody = document.getElementById('tabla-reservas-body');
  if (!tbody) return;

  let reservas = [];
  try {
    const data = localStorage.getItem('rinconcito_reservas');
    reservas = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer las reservas", error);
    reservas = [];
  }

  tbody.innerHTML = '';

  if (reservas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Aún no hay reservas.</td></tr>';
    return;
  }

  [...reservas].reverse().forEach(reserva => {
    // ... el resto del código de la reserva se mantiene igual ...
    const selectEstado = `
      <select onchange="cambiarEstadoReserva('${reserva.id}', this.value)" class="text-xs font-semibold rounded-full px-2 py-1 border-0 outline-none cursor-pointer ${reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
        <option value="Pendiente" ${reserva.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="Confirmada" ${reserva.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
        <option value="Asistió" ${reserva.estado === 'Asistió' ? 'selected' : ''}>Asistió</option>
      </select>
    `;

    const btnEliminar = rolActual === 'admin'
      ? `<button onclick="eliminarReserva('${reserva.id}')" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>`
      : '';

    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-50 hover:bg-gray-50 transition-colors";
    tr.innerHTML = `
      <td class="p-4">
        <p class="font-medium text-ink-900">${reserva.nombre}</p>
        <p class="text-xs text-gray-500">${reserva.telefono}</p>
      </td>
      <td class="p-4">
        <p class="text-sm font-medium text-ink-900">${reserva.fecha}</p>
        <p class="text-xs text-gray-500">${reserva.hora}</p>
      </td>
      <td class="p-4 text-sm font-medium text-gray-700">${reserva.personas} pers.</td>
      <td class="p-4">${selectEstado}</td>
      <td class="p-4 text-right">${btnEliminar}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* =========================================================
   4. ACCIONES (ELIMINAR, CAMBIAR ESTADO)
   ========================================================= */
function eliminarPlato(id) {
  if (rolActual !== 'admin') return alert('Solo el administrador puede eliminar platos.');
  if (confirm('¿Eliminar este plato de la carta?')) {
    let platos = JSON.parse(localStorage.getItem('rinconcito_platos')) || [];
    platos = platos.filter(p => p.id !== id);
    localStorage.setItem('rinconcito_platos', JSON.stringify(platos));
    renderizarTablaPlatos();
    actualizarKPIs();
  }
}

function cambiarEstadoReserva(id, nuevoEstado) {
  let reservas = JSON.parse(localStorage.getItem('rinconcito_reservas')) || [];
  const index = reservas.findIndex(r => r.id === id);
  if (index !== -1) {
    reservas[index].estado = nuevoEstado;
    localStorage.setItem('rinconcito_reservas', JSON.stringify(reservas));
    renderizarTablaReservas(); 
  }
}

function eliminarReserva(id) {
  if (rolActual !== 'admin') return alert('Solo el administrador puede eliminar reservas.');
  if (confirm('¿Eliminar esta reserva permanentemente?')) {
    let reservas = JSON.parse(localStorage.getItem('rinconcito_reservas')) || [];
    reservas = reservas.filter(r => r.id !== id);
    localStorage.setItem('rinconcito_reservas', JSON.stringify(reservas));
    renderizarTablaReservas();
    actualizarKPIs();
  }
}

/* =========================================================
   5. MODALES Y FORMULARIOS
   ========================================================= */
// --- MODAL PLATOS ---
function abrirModalPlato() {
  document.getElementById('modal-plato').classList.remove('hidden');
  document.getElementById('modal-plato').classList.add('flex');
}

function cerrarModalPlato() {
  document.getElementById('modal-plato').classList.add('hidden');
  document.getElementById('modal-plato').classList.remove('flex');
  document.getElementById('form-plato').reset();
}

const formPlato = document.getElementById('form-plato');
if (formPlato) {
  formPlato.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoPlato = {
      id: 'p_' + Date.now(),
      nombre: document.getElementById('plato-nombre').value,
      precio: parseFloat(document.getElementById('plato-precio').value),
      categoria: document.getElementById('plato-categoria').value,
      imagen: document.getElementById('plato-imagen').value,
      descripcion: document.getElementById('plato-desc').value
    };

    let platos = JSON.parse(localStorage.getItem('rinconcito_platos')) || [];
    platos.push(nuevoPlato);
    localStorage.setItem('rinconcito_platos', JSON.stringify(platos));

    cerrarModalPlato();
    renderizarTablaPlatos();
    actualizarKPIs();
  });
}

// --- MODAL RESERVAS ---
function abrirModalReserva() {
  document.getElementById('modal-reserva').classList.remove('hidden');
  document.getElementById('modal-reserva').classList.add('flex');
  document.getElementById('admin-res-fecha').value = new Date().toISOString().split('T')[0];
}

function cerrarModalReserva() {
  document.getElementById('modal-reserva').classList.add('hidden');
  document.getElementById('modal-reserva').classList.remove('flex');
  document.getElementById('form-reserva-admin').reset();
}

const formReservaAdmin = document.getElementById('form-reserva-admin');
if (formReservaAdmin) {
  formReservaAdmin.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevaReserva = {
      id: 'res_' + Date.now(),
      nombre: document.getElementById('admin-res-nombre').value,
      telefono: document.getElementById('admin-res-telefono').value,
      fecha: document.getElementById('admin-res-fecha').value,
      hora: document.getElementById('admin-res-hora').value,
      personas: document.getElementById('admin-res-personas').value,
      notas: 'Ingresada manualmente',
      estado: 'Confirmada'
    };

    let reservas = JSON.parse(localStorage.getItem('rinconcito_reservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('rinconcito_reservas', JSON.stringify(reservas));

    cerrarModalReserva();
    renderizarTablaReservas();
    actualizarKPIs();
  });
}