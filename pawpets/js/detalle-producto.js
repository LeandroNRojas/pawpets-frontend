// ===== DATOS DE PRODUCTOS (deben coincidir con los ids usados en productos.html) =====
const productos = [
  { id: 1, nombre: "Alimento Premium Perro Adulto", categoria: "Alimentos Perro", precio: 18990,
    imagen: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600",
    descripcion: "Alimento balanceado premium para perros adultos, formulado con proteínas de alta calidad, ideal para mantener la energía y salud de tu mascota." },
  { id: 2, nombre: "Snacks Naturales", categoria: "Alimentos Perro", precio: 5990,
    imagen: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600",
    descripcion: "Snacks 100% naturales, sin conservantes artificiales, perfectos como premio durante el entrenamiento." },
  { id: 3, nombre: "Alimento Gato Esterilizado", categoria: "Alimentos Gato", precio: 16490,
    imagen: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600",
    descripcion: "Fórmula especial para gatos esterilizados, ayuda a controlar el peso y cuidar la salud urinaria." },
  { id: 4, nombre: "Arena Sanitaria Aglomerante", categoria: "Alimentos Gato", precio: 9990,
    imagen: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600",
    descripcion: "Arena de alta absorción, control de olores y fácil limpieza para la caja sanitaria de tu gato." },
  { id: 5, nombre: "Pelota Interactiva", categoria: "Juguetes & Accesorios", precio: 7490,
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    descripcion: "Pelota resistente diseñada para estimular el juego y el ejercicio físico de tu mascota." },
  { id: 6, nombre: "Correa Ajustable", categoria: "Juguetes & Accesorios", precio: 12990,
    imagen: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600",
    descripcion: "Correa resistente y ajustable, cómoda tanto para el paseo como para el entrenamiento." },
  { id: 7, nombre: "Shampoo Antipulgas", categoria: "Salud", precio: 8990,
    imagen: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600",
    descripcion: "Shampoo formulado para eliminar y prevenir pulgas y garrapatas, cuidando la piel de tu mascota." },
  { id: 8, nombre: "Vitaminas Multiespecie", categoria: "Salud", precio: 11990,
    imagen: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600",
    descripcion: "Complejo vitamínico para perros y gatos, refuerza el sistema inmune y mejora el pelaje." }
];

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const contenedor = document.getElementById("detalle-contenedor");
  const gridRelacionados = document.getElementById("grid-relacionados");

  const producto = productos.find(function (p) { return p.id === id; });

  if (!producto) {
    contenedor.innerHTML = "<p>No se encontró el producto solicitado. <a href='productos.html'>Volver al catálogo</a>.</p>";
    return;
  }

  document.title = producto.nombre + " | PawPets";

  contenedor.innerHTML =
    '<article class="card" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1.5rem;">' +
      '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" style="border-radius: 10px;">' +
      '<div>' +
        '<h1>' + producto.nombre + '</h1>' +
        '<p style="color: var(--color-secundario); margin: 0.5rem 0;">' + producto.categoria + '</p>' +
        '<p style="font-size: 1.5rem; font-weight: bold; margin: 1rem 0;">$' + producto.precio.toLocaleString("es-CL") + '</p>' +
        '<p style="margin-bottom: 1.5rem;">' + producto.descripcion + '</p>' +
        '<label for="cantidad" style="display:block; margin-bottom: 0.4rem; font-weight:600;">Cantidad</label>' +
        '<input type="number" id="cantidad" name="cantidad" value="1" min="1" max="10" style="width: 80px; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 6px;">' +
        '<br>' +
        '<button type="button" id="btn-agregar-detalle" class="btn">Agregar al carrito</button>' +
        '<p id="mensaje-agregado" class="mensaje-error" style="color: var(--color-exito);"></p>' +
      '</div>' +
    '</article>';

  document.getElementById("btn-agregar-detalle").addEventListener("click", function () {
    const cantidad = document.getElementById("cantidad").value;
    document.getElementById("mensaje-agregado").textContent =
      "✓ Agregaste " + cantidad + " unidad(es) de " + producto.nombre + " al carrito.";
  });

  // Productos relacionados: misma categoría, excluyendo el actual
  const relacionados = productos.filter(function (p) {
    return p.categoria === producto.categoria && p.id !== producto.id;
  });

  relacionados.forEach(function (p) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<a href="detalle-producto.html?id=' + p.id + '">' +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '">' +
      '</a>' +
      '<div class="card-body">' +
        '<h3><a href="detalle-producto.html?id=' + p.id + '">' + p.nombre + '</a></h3>' +
        '<p>$' + p.precio.toLocaleString("es-CL") + '</p>' +
      '</div>';
    gridRelacionados.appendChild(card);
  });
});