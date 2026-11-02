/* =========================================
   Inkari Art - Lógica de la Tienda
   ========================================= */

// Estado global del carrito
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar carrito guardado en LocalStorage
    const carritoGuardado = localStorage.getItem('inkari_carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoUI();
    }

    // 2. Renderizar productos en el catálogo
    renderizarProductos();

    // 3. Eventos del Sidebar (Abrir/Cerrar)
    const btnCarrito = document.getElementById('btn-carrito');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    const overlay = document.getElementById('carrito-overlay');
    const panel = document.getElementById('carrito-panel');

    const abrirPanel = () => {
        panel.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    };

    const cerrarPanel = () => {
        panel.classList.add('translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    };

    btnCarrito.addEventListener('click', abrirPanel);
    cerrarCarrito.addEventListener('click', cerrarPanel);
    overlay.addEventListener('click', cerrarPanel);
});

/* =========================================
   RENDERIZADO DEL CATÁLOGO
   ========================================= */
function renderizarProductos() {
    const grid = document.getElementById('grid-productos');
    if (!grid) return;
    grid.innerHTML = '';

    PRODUCTOS.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'group relative flex flex-col';

        card.innerHTML = `
            <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-earth-100 mb-4 card-hover cursor-pointer">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-earth-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    ${producto.categoria}
                </span>
                <button onclick="agregarAlCarrito('${producto.id}')" class="absolute bottom-4 right-4 bg-earth-900 text-white h-10 w-10 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-terra-500 shadow-lg" title="Añadir al carrito">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
            <div class="flex justify-between items-start gap-4">
                <div>
                    <h3 class="font-serif text-lg font-bold text-earth-900 leading-tight mb-1 group-hover:text-terra-500 transition-colors cursor-pointer">${producto.nombre}</h3>
                    <p class="text-xs text-earth-800 line-clamp-1">${producto.descripcion}</p>
                </div>
                <span class="font-bold text-earth-900 whitespace-nowrap">S/ ${producto.precio.toFixed(2)}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* =========================================
   LÓGICA DEL CARRITO
   ========================================= */
function agregarAlCarrito(id) {
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad += 1;
    } else {
        const productoOriginal = PRODUCTOS.find(p => p.id === id);
        carrito.push({ ...productoOriginal, cantidad: 1 });
        mostrarToast(`"${productoOriginal.nombre}" añadido al carrito`);
    }

    guardarYActualizar();
    
    // Abrir carrito automáticamente
    document.getElementById('carrito-panel').classList.remove('translate-x-full');
    document.getElementById('carrito-overlay').classList.remove('opacity-0', 'pointer-events-none');
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarYActualizar();
}

function cambiarCantidad(id, delta) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarYActualizar();
        }
    }
}

function guardarYActualizar() {
    localStorage.setItem('inkari_carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contenedorItems = document.getElementById('carrito-items');
    const badgeCount = document.getElementById('carrito-count');
    const badgeTitle = document.getElementById('carrito-count-title');
    const subtotalEl = document.getElementById('carrito-subtotal');

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    // Actualizar badges
    if (totalItems > 0) {
        badgeCount.textContent = totalItems;
        badgeCount.classList.remove('opacity-0', 'scale-0');
        badgeCount.classList.add('opacity-100', 'scale-100');
        badgeTitle.textContent = totalItems;
    } else {
        badgeCount.classList.add('opacity-0', 'scale-0');
        badgeCount.classList.remove('opacity-100', 'scale-100');
    }

    // Renderizar items
    if (carrito.length === 0) {
        contenedorItems.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center opacity-50">
                <svg class="h-16 w-16 mb-4 text-earth-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <p class="font-serif text-lg font-bold text-earth-900">Tu carrito está vacío</p>
                <p class="text-sm text-earth-800">Descubre nuestras piezas únicas.</p>
            </div>
        `;
    } else {
        contenedorItems.innerHTML = carrito.map(item => `
            <div class="flex gap-4">
                <div class="h-20 w-20 rounded-lg overflow-hidden bg-earth-100 flex-shrink-0">
                    <img src="${item.imagen}" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start gap-2">
                            <h4 class="font-serif font-bold text-earth-900 leading-tight">${item.nombre}</h4>
                            <button onclick="eliminarDelCarrito('${item.id}')" class="text-earth-800 hover:text-terra-500">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                        <p class="text-xs text-earth-800">S/ ${item.precio.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center border border-earth-100 rounded-md">
                            <button onclick="cambiarCantidad('${item.id}', -1)" class="px-2 py-1 text-earth-800 hover:text-terra-500">-</button>
                            <span class="px-3 text-sm font-medium">${item.cantidad}</span>
                            <button onclick="cambiarCantidad('${item.id}', 1)" class="px-2 py-1 text-earth-800 hover:text-terra-500">+</button>
                        </div>
                        <span class="font-bold text-sm">S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
}

/* =========================================
   NOTIFICACIÓN FLOTANTE (TOAST)
   ========================================= */
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    
    toastMsg.textContent = mensaje;
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}