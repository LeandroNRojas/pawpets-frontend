// ===== LÓGICA DE LA PÁGINA DE PRODUCTOS =====

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-filtro");
  const selectCategoria = document.getElementById("categoria");
  const inputBusqueda = document.getElementById("busqueda");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const resultadoInfo = document.getElementById("resultado-info");
  const tarjetas = document.querySelectorAll("#grid-productos .card");

  // Filtra las tarjetas según categoría y texto de búsqueda
  function filtrarProductos(categoria, texto) {
    let visibles = 0;
    const textoLower = texto.trim().toLowerCase();

    tarjetas.forEach(function (card) {
      const catCard = card.dataset.categoria;
      const nombreCard = card.dataset.nombre.toLowerCase();

      const coincideCategoria = categoria === "todos" || catCard === categoria;
      const coincideTexto = textoLower === "" || nombreCard.includes(textoLower);

      if (coincideCategoria && coincideTexto) {
        card.style.display = "";
        visibles++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibles === 0) {
      resultadoInfo.textContent = "No se encontraron productos con ese filtro.";
    } else {
      resultadoInfo.textContent = "Mostrando " + visibles + " producto(s).";
    }
  }

  // Evento: enviar el formulario de búsqueda
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    filtrarProductos(selectCategoria.value, inputBusqueda.value);
  });

  // Evento: cambiar la categoría filtra al instante, sin esperar el submit
  selectCategoria.addEventListener("change", function () {
    filtrarProductos(selectCategoria.value, inputBusqueda.value);
  });

  // Evento: botón "Limpiar filtros"
  btnLimpiar.addEventListener("click", function () {
    form.reset();
    filtrarProductos("todos", "");
  });

  // Evento: botón "Agregar al carrito" en cada tarjeta
  document.querySelectorAll(".btn-agregar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const card = boton.closest(".card");
      const producto = {
        id: parseInt(card.dataset.id),
        nombre: card.dataset.nombre,
        precio: parseInt(card.dataset.precio)
      };

      agregarAlCarrito(producto, 1);

      boton.textContent = "¡Agregado! ✓";
      boton.disabled = true;

      setTimeout(function () {
        boton.textContent = "Agregar al carrito";
        boton.disabled = false;
      }, 1500);
    });
  });
});