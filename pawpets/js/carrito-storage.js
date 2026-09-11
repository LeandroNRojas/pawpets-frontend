// ===== MANEJO DEL CARRITO CON localStorage (compartido por todas las páginas) =====
const CARRITO_KEY = "pawpets_carrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CARRITO_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(producto, cantidad) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.id === producto.id; });

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
}

function actualizarCantidadCarrito(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(function (p) { return p.id === id; });
  if (item) {
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
  }
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(function (p) { return p.id !== id; });
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function calcularTotalCarrito(carrito) {
  return carrito.reduce(function (total, item) {
    return total + (item.precio * item.cantidad);
  }, 0);
}

function contarUnidadesCarrito(carrito) {
  return carrito.reduce(function (total, item) {
    return total + item.cantidad;
  }, 0);
}

function actualizarBadgeCarrito() {
  const enlaceCarrito = document.querySelector('nav a[href="carrito.html"]');
  if (!enlaceCarrito) return;

  const cantidad = contarUnidadesCarrito(obtenerCarrito());
  enlaceCarrito.textContent = cantidad > 0 ? "Carrito (" + cantidad + ")" : "Carrito";
}