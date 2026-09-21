/* ============================================================
   admin-dashboard.js
   Llena el saludo y las estadísticas del panel a partir de lo que
   ya hay guardado en localStorage (mismos datos que usan
   admin-productos.js y el registro/login de clientes).
   ============================================================ */
"use strict";

const CLAVE_PRODUCTOS = "pawpets_productos";

document.addEventListener("DOMContentLoaded", function () {

  // ----- Saludo personalizado -----
  const sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"));
  const saludo = document.getElementById("saludo-admin");
  if (saludo && sesionActiva && sesionActiva.nombre) {
    const primerNombre = sesionActiva.nombre.split(" ")[0];
    saludo.textContent = `¡Hola, ${primerNombre}!`;
  }

  // ----- Estadísticas -----
  const productos = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
  const sinStock = productos.filter(function (p) {
    return Number(p.stock) === 0;
  }).length;

  // Por ahora solo existe una cuenta de cliente a la vez (ver validaciones.js).
  const hayClienteRegistrado = localStorage.getItem("usuarioRegistrado") ? 1 : 0;

  const statProductos = document.getElementById("stat-productos");
  const statSinStock = document.getElementById("stat-sin-stock");
  const statUsuarios = document.getElementById("stat-usuarios");

  if (statProductos) statProductos.textContent = productos.length;
  if (statSinStock) statSinStock.textContent = sinStock;
  if (statUsuarios) statUsuarios.textContent = hayClienteRegistrado;

});