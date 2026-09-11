// ===== LÓGICA DEL CARRITO (datos de ejemplo, sin backend) =====
let carrito = [
  { id: 1, nombre: "Alimento Premium Perro Adulto", precio: 18990, cantidad: 1 },
  { id: 3, nombre: "Alimento Gato Esterilizado", precio: 16490, cantidad: 2 }
];

// ===== LÓGICA DEL CARRITO (conectado a localStorage) =====

function renderizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const vacio = document.getElementById("carrito-vacio");
  const totalSpan = document.getElementById("carrito-total");

  if (!lista) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    lista.innerHTML = "";
    vacio.style.display = "block";
    totalSpan.textContent = "$0";
    return;
  }

  vacio.style.display = "none";
  lista.innerHTML = "";

  carrito.forEach(function (item, index) {
    const subtotal = item.precio * item.cantidad;

    const fila = document.createElement("div");
    fila.className = "card";
    fila.style.padding = "1rem";
    fila.style.marginBottom = "1rem";
    fila.style.display = "flex";
    fila.style.justifyContent = "space-between";
    fila.style.alignItems = "center";
    fila.innerHTML =
      '<div><strong>' + item.nombre + '</strong><br>$' + item.precio.toLocaleString("es-CL") + ' c/u</div>' +
      '<div style="display:flex; align-items:center; gap:0.5rem;">' +
        '<label for="cantidad-' + index + '" style="margin:0;">Cant.</label>' +
        '<input type="number" id="cantidad-' + index + '" min="1" max="10" value="' + item.cantidad + '" style="width:60px; padding:0.4rem;">' +
        '<span style="min-width:90px; text-align:right; font-weight:bold;">$' + subtotal.toLocaleString("es-CL") + '</span>' +
        '<button type="button" class="btn btn-eliminar" data-id="' + item.id + '" style="background-color: var(--color-error); padding: 0.5rem 0.8rem;">✕</button>' +
      '</div>';
    lista.appendChild(fila);
  });

  const total = calcularTotalCarrito(carrito);
  totalSpan.textContent = "$" + total.toLocaleString("es-CL");

  carrito.forEach(function (item, index) {
    const input = document.getElementById("cantidad-" + index);
    if (input) {
      input.addEventListener("change", function () {
        let valor = parseInt(input.value);
        if (isNaN(valor) || valor < 1) valor = 1;
        actualizarCantidadCarrito(item.id, valor);
        renderizarCarrito();
      });
    }
  });

  document.querySelectorAll(".btn-eliminar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const id = parseInt(boton.dataset.id);
      eliminarDelCarrito(id);
      renderizarCarrito();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderizarCarrito);

  // Eventos de eliminar producto
  document.querySelectorAll(".btn-eliminar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const idx = parseInt(boton.dataset.index);
      carrito.splice(idx, 1);
      renderizarCarrito();
    });
  });


document.addEventListener("DOMContentLoaded", renderizarCarrito);