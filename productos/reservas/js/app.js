/* =========================================================
   app.js — Lógica de la vista del cliente
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderizarPlatos();
  configurarFormularioReserva(); // <-- NUEVO
});

function renderizarPlatos() {
  const grid = document.getElementById('grid-platos');
  if (!grid) return;

  const platos = JSON.parse(localStorage.getItem('rinconcito_platos')) || [];
  grid.innerHTML = '';

  if (platos.length === 0) {
    grid.innerHTML = '<p class="text-center col-span-full text-ink-700 font-serif italic">La cocina está preparando algo especial...</p>';
    return;
  }

  platos.forEach(plato => {
    const card = document.createElement('article');
    // Tarjeta estilo "pizarra" o "madera" rupestre
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-cal-100 flex flex-col h-full';
    
    card.innerHTML = `
      <div class="relative h-64 overflow-hidden">
        <!-- Foto con efecto hover -->
        <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <!-- Etiqueta de categoría -->
        <span class="absolute top-4 right-4 bg-maiz-500 text-ink-900 text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wide shadow-md">
          ${plato.categoria}
        </span>
      </div>
      
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-display text-2xl font-bold text-adobe-500">${plato.nombre}</h3>
          <span class="font-serif text-xl font-bold text-ink-900">S/ ${plato.precio.toFixed(2)}</span>
        </div>
        
        <p class="text-sm text-ink-700 leading-relaxed font-serif flex-grow">${plato.descripcion}</p>
        
        <!-- Botón rápido para pedir (visual) -->
        <button class="mt-6 w-full py-2.5 border-2 border-adobe-500 text-adobe-500 font-semibold text-sm rounded-lg hover:bg-adobe-500 hover:text-cal-50 transition-colors">
          Añadir a la reserva
        </button>
      </div>
    `;
    
    grid.appendChild(card);
  });
}
/* =========================================================
   Lógica del Formulario de Reserva
   ========================================================= */
function configurarFormularioReserva() {
  const form = document.getElementById('form-reserva');
  if (!form) return;

  // Prevenir que el usuario seleccione fechas pasadas
  const fechaInput = document.getElementById('res-fecha');
  const today = new Date().toISOString().split('T')[0];
  fechaInput.min = today;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Capturar datos
    const nuevaReserva = {
      id: 'res_' + Date.now(), // ID único
      nombre: document.getElementById('res-nombre').value.trim(),
      telefono: document.getElementById('res-telefono').value.trim(),
      fecha: document.getElementById('res-fecha').value,
      hora: document.getElementById('res-hora').value,
      personas: document.getElementById('res-personas').value,
      notas: document.getElementById('res-notas').value.trim(),
      estado: 'Pendiente', // Por defecto
      creadaEl: new Date().toISOString()
    };

    // 2. Obtener reservas existentes
    let reservasGuardadas = JSON.parse(localStorage.getItem('rinconcito_reservas')) || [];
    
    // 3. Guardar la nueva
    reservasGuardadas.push(nuevaReserva);
    localStorage.setItem('rinconcito_reservas', JSON.stringify(reservasGuardadas));

    // 4. Feedback visual (Reemplazar el formulario por mensaje de éxito)
    mostrarMensajeExito(nuevaReserva);
  });
}

function mostrarMensajeExito(reserva) {
  const form = document.getElementById('form-reserva');
  const contenedorForm = form.parentElement; // Div que contiene el form
  
  // Formatear fecha a algo bonito (Ej: Viernes, 24 de Nov)
  const fechaObj = new Date(reserva.fecha + 'T00:00:00');
  const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long' };
  const fechaBonita = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

  // HTML de éxito
  contenedorForm.innerHTML = `
    <div class="text-center py-12 animate-[hero-fade-up_0.5s_ease-out_forwards]">
      <div class="mx-auto h-20 w-20 bg-huerto-500 text-cal-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 class="font-display text-3xl font-bold text-ink-900 mb-2">¡Reserva Confirmada!</h3>
      <p class="text-ink-700 font-serif mb-6">Gracias, <strong class="text-adobe-500">${reserva.nombre}</strong>. Te esperamos en El Rinconcito Cusqueño.</p>
      
      <div class="bg-cal-100 rounded-lg p-4 inline-block text-left text-sm text-ink-700 mb-8 border border-cal-100/50">
        <p><strong>Fecha:</strong> ${fechaBonita}</p>
        <p><strong>Hora:</strong> ${reserva.hora}</p>
        <p><strong>Personas:</strong> ${reserva.personas}</p>
        ${reserva.notas ? `<p><strong>Notas:</strong> ${reserva.notas}</p>` : ''}
      </div>

      <button onclick="location.reload()" class="block w-full bg-ink-900 text-cal-50 font-bold rounded-lg py-3 hover:bg-ink-700 transition-colors">
        Hacer otra reserva
      </button>
    </div>
  `;
}