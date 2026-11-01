/* =========================================================
   data.js — Datos base de "El Rinconcito Cusqueño"
   ========================================================= */

const PLATOS_INICIALES = [
  {
    id: 'p1',
    nombre: 'Cuy Chactado',
    descripcion: 'Tierno cuy frito a la leña, acompañado de papas doradas y ensalada fresca con hierbas de la zona.',
    precio: 48.00,
    categoria: 'Especialidad',
    imagen: 'img/cuy-chactado.webp' // <-- Actualizado a tu foto local
  },
  {
    id: 'p2',
    nombre: 'Lomo Saltado',
    descripcion: 'Jugosos trozos de res salteados al wok con cebolla, tomate y ají amarillo. Servido con papas fritas y arroz.',
    precio: 38.00,
    categoria: 'Extras',
    imagen: 'img/lomo.png' // <-- Actualizado a tu foto local
  },
  {
    id: 'p3',
    nombre: 'Chicha Morada',
    descripcion: 'Refrescante bebida tradicional a base de maíz morado, piña, canela y clavo.',
    precio: 12.00,
    categoria: 'Bebida',
    imagen: 'img/chicha-moradita.jpe' // <-- Actualizado a tu foto local
  },
  {
    id: 'p4',
    nombre: 'Caldo Criollo',
    descripcion: 'Reconfortante caldo de res con hierbas andinas, fideo cabello de ángel y un toque de limón.',
    precio: 25.00,
    categoria: 'Sopas',
    imagen: 'img/caldo.jpe' // <-- NUEVO PLATO
  }
];

// Guardar en localStorage si no existe
if (!localStorage.getItem('rinconcito_platos')) {
  localStorage.setItem('rinconcito_platos', JSON.stringify(PLATOS_INICIALES));
}