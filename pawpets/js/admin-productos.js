/* ============================================================
   admin-productos.js
   CRUD de productos guardado en localStorage, con guía visual
   y mensajes claros para cada acción.
   ============================================================ */
"use strict";

const CLAVE_STORAGE = "pawpets_productos";
const CLAVE_GUIA_OCULTA = "pawpets_admin_guia_oculta"; // NUEVO

const NOMBRES_CATEGORIA = {
  perro: "Alimentos Perro",
  gato: "Alimentos Gato",
  juguetes: "Juguetes & Accesorios",
  salud: "Salud"
};

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">' +
    '<rect width="120" height="120" fill="#eeeeee"/>' +
    '<text x="60" y="65" font-size="34" text-anchor="middle">🐾</text></svg>'
  );

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Alimento Premium Perro Adulto", categoria: "perro",
    precio: 18990, stock: 25,
    descripcion: "Alimento completo y balanceado para perros adultos de todas las razas.",
    imagen: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400" },
  { id: 2, nombre: "Snacks Naturales", categoria: "perro",
    precio: 5990, stock: 60,
    descripcion: "Snacks deshidratados sin conservantes, ideales para premiar y entrenar.",
    imagen: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400" },
  { id: 3, nombre: "Alimento Gato Esterilizado", categoria: "gato",
    precio: 16490, stock: 18,
    descripcion: "Fórmula baja en grasas para gatos esterilizados, cuida el peso y las vías urinarias.",
    imagen: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400" },
  { id: 4, nombre: "Arena Sanitaria Aglomerante", categoria: "gato",
    precio: 9990, stock: 40,
    descripcion: "Arena de alta absorción que forma grumos firmes y controla el olor.",
    imagen: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=400" },
  { id: 5, nombre: "Pelota Interactiva", categoria: "juguetes",
    precio: 7490, stock: 12,
    descripcion: "Pelota dispensadora de premios que estimula el juego y reduce el aburrimiento.",
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400" },
  { id: 6, nombre: "Correa Ajustable", categoria: "juguetes",
    precio: 12990, stock: 30,
    descripcion: "Correa de nylon reforzado con largo regulable y mosquetón de seguridad.",
    imagen: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400" },
  { id: 7, nombre: "Shampoo Antipulgas", categoria: "salud",
    precio: 8990, stock: 0,
    descripcion: "Shampoo de uso veterinario que elimina pulgas y calma la piel irritada.",
    imagen: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400" },
  { id: 8, nombre: "Vitaminas Multiespecie", categoria: "salud",
    precio: 11990, stock: 22,
    descripcion: "Suplemento vitamínico en comprimidos para perros y gatos de todas las edades.",
    imagen: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400" }
];

/* Referencias al HTML */
const form             = document.getElementById("form-producto");
const inputId          = document.getElementById("producto-id");
const inputNombre      = document.getElementById("nombre");
const inputCategoria   = document.getElementById("categoria");
const inputPrecio      = document.getElementById("precio");
const inputStock       = document.getElementById("stock");
const inputImagen      = document.getElementById("imagen");
const inputDescripcion = document.getElementById("descripcion");
const previewImagen    = document.getElementById("preview-imagen");
const tituloForm       = document.getElementById("titulo-form");
const btnToggleForm    = document.getElementById("btn-toggle-form");
const btnCancelar      = document.getElementById("btn-cancelar");
const contenedorTabla  = document.getElementById("contenedor-tabla");
const tabla            = document.getElementById("tabla-productos");
const estadoVacio      = document.getElementById("estado-vacio");
const mensajeVacio     = document.getElementById("mensaje-vacio");
const btnVacioAccion   = document.getElementById("btn-vacio-accion");
const contadorLista    = document.getElementById("contador-lista");
const aviso            = document.getElementById("aviso");
const inputBuscar      = document.getElementById("buscar");
const filtroCategoria  = document.getElementById("filtro-categoria");
const guia             = document.getElementById("guia");
const btnCerrarGuia    = document.getElementById("btn-cerrar-guia");
const btnReabrirGuia   = document.getElementById("btn-reabrir-guia");

let productos = [];

/* ---------- Almacenamiento ---------- */
function cargarProductos() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (!guardado) return PRODUCTOS_INICIALES.map(p => ({ ...p }));
  try {
    const datos = JSON.parse(guardado);
    return Array.isArray(datos) ? datos : PRODUCTOS_INICIALES.map(p => ({ ...p }));
  } catch (error) {
    console.error("localStorage dañado, se usa el catálogo inicial:", error);
    return PRODUCTOS_INICIALES.map(p => ({ ...p }));
  }
}

function guardarProductos() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

function generarId() {
  if (productos.length === 0) return 1;
  return Math.max(...productos.map(p => p.id)) + 1;
}

/* ---------- Presentación ---------- */
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

function claseStock(stock) {
  if (stock === 0) return "stock-agotado";
  if (stock < 10)  return "stock-bajo";
  return "stock-ok";
}

function mostrarAviso(texto, tipo) {
  const icono = tipo === "exito" ? "✅" : "⚠️";
  aviso.innerHTML = `<span aria-hidden="true">${icono}</span> ${texto}`;
  aviso.className = "admin-aviso " + tipo;
  setTimeout(() => { aviso.className = "admin-aviso"; }, 3500);
}

/* ---------- Guía rápida (NUEVO) ---------- */
function inicializarGuia() {
  const ocultarPorDefecto = localStorage.getItem(CLAVE_GUIA_OCULTA) === "true";
  guia.hidden = ocultarPorDefecto;
  btnReabrirGuia.hidden = !ocultarPorDefecto;
}

btnCerrarGuia.addEventListener("click", () => {
  guia.hidden = true;
  btnReabrirGuia.hidden = false;
  localStorage.setItem(CLAVE_GUIA_OCULTA, "true");
});

btnReabrirGuia.addEventListener("click", () => {
  guia.hidden = false;
  btnReabrirGuia.hidden = true;
  localStorage.setItem(CLAVE_GUIA_OCULTA, "false");
});

/* ---------- Formulario colapsable ---------- */
function mostrarFormulario() {
  form.hidden = false;
  btnToggleForm.innerHTML = '<span aria-hidden="true">✕</span> Ocultar formulario';
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  inputNombre.focus();   // deja el cursor listo para escribir de inmediato
}

function ocultarFormulario() {
  form.hidden = true;
  btnToggleForm.innerHTML = '<span aria-hidden="true">➕</span> Agregar producto';
  limpiarFormulario();
}

btnToggleForm.addEventListener("click", () => {
  if (form.hidden) {
    mostrarFormulario();
  } else {
    ocultarFormulario();
  }
});

// El botón dentro del estado vacío también abre el formulario.
btnVacioAccion.addEventListener("click", mostrarFormulario);

/* ---------- Dibujar tabla ---------- */
function renderizarTabla(lista) {
  tabla.innerHTML = "";

  const hayProductosEnTotal = productos.length > 0;
  const hayResultadosFiltrados = lista.length > 0;

  // Mostrar tabla o estado vacío según corresponda.
  contenedorTabla.style.display = hayResultadosFiltrados ? "block" : "none";
  estadoVacio.style.display = hayResultadosFiltrados ? "none" : "block";

  if (!hayResultadosFiltrados) {
    if (hayProductosEnTotal) {
      // Hay productos, pero el filtro/búsqueda no encontró nada.
      mensajeVacio.textContent = "No hay productos que coincidan con tu búsqueda. Prueba con otro nombre o categoría.";
      btnVacioAccion.textContent = "Limpiar filtros";
    } else {
      // El catálogo está realmente vacío.
      mensajeVacio.textContent = "Todavía no has agregado ningún producto.";
      btnVacioAccion.textContent = "Agregar mi primer producto";
    }
    return;
  }

  lista.forEach(producto => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td data-label="Imagen">
        <img class="admin-miniatura" src="${producto.imagen}"
             alt="${producto.nombre}"
             onerror="this.src='${IMAGEN_RESPALDO}'">
      </td>
      <td data-label="Nombre">
        <strong>${producto.nombre}</strong>
      </td>
      <td data-label="Categoría">
        <span class="admin-etiqueta">${NOMBRES_CATEGORIA[producto.categoria]}</span>
      </td>
      <td data-label="Precio">${formatearPrecio(producto.precio)}</td>
      <td data-label="Stock" class="${claseStock(producto.stock)}">
        ${producto.stock === 0 ? "Agotado" : producto.stock + " u."}
      </td>
      <td data-label="Acciones">
        <button type="button" class="btn-mini btn-editar"
                data-accion="editar" data-id="${producto.id}">✏️ Editar</button>
        <button type="button" class="btn-mini btn-eliminar"
                data-accion="eliminar" data-id="${producto.id}">🗑️ Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

function actualizarEstadisticas() {
  const agotados = productos.filter(p => p.stock === 0).length;
  document.getElementById("stat-total").textContent = productos.length;
  document.getElementById("stat-agotados").textContent = agotados;
}

function aplicarFiltros() {
  const texto = inputBuscar.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productos.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto);
    const coincideCategoria = (categoria === "todos") || (producto.categoria === categoria);
    return coincideTexto && coincideCategoria;
  });

  // Texto contador: "8 de 8 productos" o "3 de 8 productos"
  contadorLista.textContent = `${filtrados.length} de ${productos.length} producto(s)`;

  renderizarTabla(filtrados);
  actualizarEstadisticas();
}

// Si el estado vacío aparece por un filtro sin resultados, el botón
// "Limpiar filtros" debe limpiar la búsqueda en vez de abrir el formulario.
btnVacioAccion.addEventListener("click", () => {
  if (productos.length > 0) {
    inputBuscar.value = "";
    filtroCategoria.value = "todos";
    aplicarFiltros();
  }
});

/* ---------- Validaciones ---------- */
function marcarError(idCampo, mensaje) {
  const texto = mensaje ? `⚠️ ${mensaje}` : "";
  document.getElementById("error-" + idCampo).textContent = texto;
  document.getElementById(idCampo).classList.toggle("invalido", mensaje !== "");
}

function validarFormulario() {
  let valido = true;

  const nombre = inputNombre.value.trim();
  if (nombre.length < 3) {
    marcarError("nombre", "Escribe al menos 3 caracteres.");
    valido = false;
  } else {
    const idActual = inputId.value;
    const repetido = productos.some(p =>
      p.nombre.toLowerCase() === nombre.toLowerCase() && String(p.id) !== idActual
    );
    if (repetido) {
      marcarError("nombre", "Ya existe un producto con ese nombre.");
      valido = false;
    } else {
      marcarError("nombre", "");
    }
  }

  if (inputCategoria.value === "") {
    marcarError("categoria", "Selecciona una categoría de la lista.");
    valido = false;
  } else {
    marcarError("categoria", "");
  }

  const precio = Number(inputPrecio.value);
  if (inputPrecio.value === "" || isNaN(precio) || precio <= 0) {
    marcarError("precio", "Ingresa un precio mayor a 0.");
    valido = false;
  } else if (!Number.isInteger(precio)) {
    marcarError("precio", "El precio debe ser un número entero, sin decimales.");
    valido = false;
  } else {
    marcarError("precio", "");
  }

  const stock = Number(inputStock.value);
  if (inputStock.value === "" || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    marcarError("stock", "Ingresa un número entero de 0 o más.");
    valido = false;
  } else {
    marcarError("stock", "");
  }

  if (inputDescripcion.value.trim().length < 10) {
    marcarError("descripcion", "Escribe al menos 10 caracteres.");
    valido = false;
  } else {
    marcarError("descripcion", "");
  }

  const imagen = inputImagen.value.trim();
  if (imagen !== "" && !/^(https?:\/\/|img\/|\.\/|\/)/i.test(imagen)) {
    marcarError("imagen", "Usa una URL que empiece con http... o una ruta como img/...");
    valido = false;
  } else {
    marcarError("imagen", "");
  }

  return valido;
}

/* ---------- Acciones ---------- */
function limpiarFormulario() {
  form.reset();
  inputId.value = "";
  tituloForm.textContent = "Nuevo producto";
  previewImagen.src = IMAGEN_RESPALDO;
  ["nombre", "categoria", "precio", "stock", "imagen", "descripcion"]
    .forEach(campo => marcarError(campo, ""));
}

function manejarEnvio(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    mostrarAviso("Revisa los campos marcados en rojo antes de guardar.", "error");
    // Lleva la vista al primer campo con error para que no tenga que buscarlo.
    form.querySelector(".invalido")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const datos = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    precio: Number(inputPrecio.value),
    stock: Number(inputStock.value),
    descripcion: inputDescripcion.value.trim(),
    imagen: inputImagen.value.trim() || IMAGEN_RESPALDO
  };

  const esNuevo = inputId.value === "";

  if (esNuevo) {
    datos.id = generarId();
    productos.push(datos);
  } else {
    const id = Number(inputId.value);
    const indice = productos.findIndex(p => p.id === id);
    if (indice === -1) {
      mostrarAviso("No se encontró el producto que intentas editar.", "error");
      return;
    }
    productos[indice] = { id: id, ...datos };
  }

  guardarProductos();
  aplicarFiltros();
  ocultarFormulario();

  mostrarAviso(
    esNuevo
      ? `"${datos.nombre}" se agregó al catálogo.`
      : `Los cambios en "${datos.nombre}" se guardaron.`,
    "exito"
  );
}

function editarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  inputId.value          = producto.id;
  inputNombre.value      = producto.nombre;
  inputCategoria.value   = producto.categoria;
  inputPrecio.value      = producto.precio;
  inputStock.value       = producto.stock;
  inputImagen.value      = producto.imagen;
  inputDescripcion.value = producto.descripcion;
  previewImagen.src      = producto.imagen;

  tituloForm.textContent = "Editando: " + producto.nombre;
  mostrarFormulario();
}

function eliminarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // Mensaje explícito: qué se borra y que no se puede deshacer.
  const confirmado = confirm(
    `¿Eliminar "${producto.nombre}" del catálogo?\n\nEsta acción no se puede deshacer.`
  );
  if (!confirmado) return;

  productos = productos.filter(p => p.id !== id);
  guardarProductos();
  aplicarFiltros();
  mostrarAviso(`"${producto.nombre}" se eliminó del catálogo.`, "exito");

  if (Number(inputId.value) === id) ocultarFormulario();
}

/* ---------- Eventos ---------- */
form.addEventListener("submit", manejarEnvio);
btnCancelar.addEventListener("click", ocultarFormulario);
inputBuscar.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);

inputImagen.addEventListener("input", () => {
  previewImagen.src = inputImagen.value.trim() || IMAGEN_RESPALDO;
});
previewImagen.addEventListener("error", () => {
  previewImagen.src = IMAGEN_RESPALDO;
});

tabla.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "editar") {
    editarProducto(id);
  } else if (boton.dataset.accion === "eliminar") {
    eliminarProducto(id);
  }
});

/* ---------- Arranque ---------- */
productos = cargarProductos();
guardarProductos();
inicializarGuia();
aplicarFiltros();