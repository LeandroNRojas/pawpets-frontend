/* ============================================================
   admin-productos.js
   CRUD de productos (Crear, Leer, Actualizar, Eliminar)
   Los datos se guardan en localStorage del navegador.
   ============================================================ */

// "use strict" activa el modo estricto: JS avisa de errores que
// normalmente ignoraría (como usar una variable sin declarar).
"use strict";

/* ------------------------------------------------------------
   1. CONSTANTES Y DATOS INICIALES
   ------------------------------------------------------------ */

// Nombre de la "caja" dentro de localStorage donde guardamos todo.
// Usar un prefijo (pawpets_) evita chocar con otros proyectos.
const CLAVE_STORAGE = "pawpets_productos";

// Diccionario: traduce el código interno al nombre visible.
// Así no repetimos los textos en varias partes del código.
const NOMBRES_CATEGORIA = {
  perro: "Alimentos Perro",
  gato: "Alimentos Gato",
  juguetes: "Juguetes & Accesorios",
  salud: "Salud"
};

// Imagen de respaldo: un SVG gris escrito directamente en la URL
// (data URI). Se usa cuando la foto real no carga, así nunca
// aparece el ícono roto del navegador.
const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">' +
    '<rect width="120" height="120" fill="#eeeeee"/>' +
    '<text x="60" y="65" font-size="34" text-anchor="middle">🐾</text></svg>'
  );

// Catálogo de ejemplo. Son los MISMOS 8 productos y las MISMAS
// imágenes que ya están en productos.html, para que el panel y la
// tienda muestren lo mismo y las fotos calcen con cada nombre.
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

/* ------------------------------------------------------------
   2. REFERENCIAS AL HTML
   Guardamos los elementos en constantes una sola vez, en lugar de
   buscarlos con getElementById cada vez que los necesitamos.
   ------------------------------------------------------------ */

const form            = document.getElementById("form-producto");
const inputId         = document.getElementById("producto-id");
const inputNombre     = document.getElementById("nombre");
const inputCategoria  = document.getElementById("categoria");
const inputPrecio     = document.getElementById("precio");
const inputStock      = document.getElementById("stock");
const inputImagen     = document.getElementById("imagen");
const inputDescripcion= document.getElementById("descripcion");
const previewImagen   = document.getElementById("preview-imagen");
const tituloForm      = document.getElementById("titulo-form");
const btnCancelar     = document.getElementById("btn-cancelar");
const btnRestablecer  = document.getElementById("btn-restablecer");
const tabla           = document.getElementById("tabla-productos");
const sinResultados   = document.getElementById("sin-resultados");
const aviso           = document.getElementById("aviso");
const inputBuscar     = document.getElementById("buscar");
const filtroCategoria = document.getElementById("filtro-categoria");

// Variable global con el catálogo en memoria. Se llena al iniciar.
let productos = [];

/* ------------------------------------------------------------
   3. FUNCIONES DE ALMACENAMIENTO (localStorage)
   ------------------------------------------------------------ */

/**
 * Lee el catálogo desde localStorage.
 * Si no existe o está dañado, devuelve una copia de los iniciales.
 */
function cargarProductos() {
  // getItem devuelve el texto guardado, o null si la clave no existe.
  const guardado = localStorage.getItem(CLAVE_STORAGE);

  // Si no hay nada guardado todavía (primera visita), sembramos.
  if (!guardado) {
    // El spread (...) crea copias nuevas de cada objeto, para no
    // modificar sin querer la constante PRODUCTOS_INICIALES.
    return PRODUCTOS_INICIALES.map(p => ({ ...p }));
  }

  // try/catch protege contra un JSON corrupto (si alguien editó
  // el localStorage a mano, JSON.parse lanzaría un error).
  try {
    const datos = JSON.parse(guardado);          // texto  ->  array
    // Verificamos que realmente sea un array antes de confiar en él.
    return Array.isArray(datos) ? datos : PRODUCTOS_INICIALES.map(p => ({ ...p }));
  } catch (error) {
    console.error("localStorage dañado, se usa el catálogo inicial:", error);
    return PRODUCTOS_INICIALES.map(p => ({ ...p }));
  }
}

/**
 * Guarda el catálogo completo en localStorage.
 * localStorage solo almacena TEXTO, por eso convertimos con stringify.
 */
function guardarProductos() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

/**
 * Genera el siguiente ID disponible.
 * Busca el ID más alto y le suma 1, así nunca se repiten aunque
 * hayamos borrado productos del medio.
 */
function generarId() {
  if (productos.length === 0) return 1;             // catálogo vacío
  // map extrae solo los ids; Math.max(...) encuentra el mayor.
  const maximo = Math.max(...productos.map(p => p.id));
  return maximo + 1;
}

/* ------------------------------------------------------------
   4. UTILIDADES DE PRESENTACIÓN
   ------------------------------------------------------------ */

/**
 * Convierte 18990 en "$18.990" (formato chileno).
 */
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

/**
 * Devuelve la clase CSS que corresponde según el stock.
 */
function claseStock(stock) {
  if (stock === 0) return "stock-agotado";   // rojo
  if (stock < 10)  return "stock-bajo";      // naranjo
  return "stock-ok";                         // verde
}

/**
 * Muestra un mensaje arriba de la página.
 * @param {string} texto - lo que se lee
 * @param {string} tipo  - "exito" o "error"
 */
function mostrarAviso(texto, tipo) {
  aviso.textContent = texto;          // textContent evita inyectar HTML
  aviso.className = "admin-aviso " + tipo;  // activa el color y el display

  // setTimeout ejecuta algo después de X milisegundos (3000 = 3 s).
  setTimeout(() => {
    aviso.className = "admin-aviso";  // vuelve a ocultarse
  }, 3000);
}

/* ------------------------------------------------------------
   5. DIBUJAR LA TABLA
   ------------------------------------------------------------ */

/**
 * Pinta en pantalla la lista de productos recibida.
 * @param {Array} lista - productos ya filtrados
 */
function renderizarTabla(lista) {
  tabla.innerHTML = "";   // vacía la tabla antes de redibujarla

  // Si la lista quedó vacía mostramos el mensaje y salimos.
  if (lista.length === 0) {
    sinResultados.style.display = "block";
    return;                            // return corta la función aquí
  }
  sinResultados.style.display = "none";

  // forEach recorre el array y ejecuta la función con cada producto.
  lista.forEach(producto => {
    const fila = document.createElement("tr");  // crea un <tr> vacío

    // Template literal (comillas invertidas): permite escribir HTML
    // en varias líneas e insertar valores con ${...}
    fila.innerHTML = `
      <td>
        <img class="admin-miniatura" src="${producto.imagen}"
             alt="${producto.nombre}"
             onerror="this.src='${IMAGEN_RESPALDO}'">
      </td>
      <td>
        <strong>${producto.nombre}</strong><br>
        <small style="color:#777;">${producto.descripcion}</small>
      </td>
      <td><span class="admin-etiqueta">${NOMBRES_CATEGORIA[producto.categoria]}</span></td>
      <td>${formatearPrecio(producto.precio)}</td>
      <td class="${claseStock(producto.stock)}">
        ${producto.stock === 0 ? "Agotado" : producto.stock + " u."}
      </td>
      <td>
        <button type="button" class="btn-mini btn-editar"
                data-accion="editar" data-id="${producto.id}">Editar</button>
        <button type="button" class="btn-mini btn-eliminar"
                data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
      </td>
    `;
    // data-accion y data-id son "atributos de datos": guardan info
    // dentro del HTML que después leemos desde JS.

    tabla.appendChild(fila);  // inserta la fila dentro del <tbody>
  });
}

/**
 * Recalcula y muestra las 4 tarjetas de estadísticas.
 */
function actualizarEstadisticas() {
  // filter devuelve solo los que cumplen la condición; .length los cuenta.
  const agotados = productos.filter(p => p.stock === 0).length;

  // reduce "acumula" un total recorriendo el array.
  // El 0 del final es el valor inicial del acumulador.
  const unidades = productos.reduce((total, p) => total + p.stock, 0);
  const valor    = productos.reduce((total, p) => total + p.precio * p.stock, 0);

  document.getElementById("stat-total").textContent     = productos.length;
  document.getElementById("stat-agotados").textContent  = agotados;
  document.getElementById("stat-unidades").textContent  = unidades;
  document.getElementById("stat-valor").textContent     = formatearPrecio(valor);
}

/**
 * Aplica el buscador y el filtro de categoría, y redibuja todo.
 */
function aplicarFiltros() {
  // trim() quita espacios sobrantes; toLowerCase() ignora mayúsculas.
  const texto = inputBuscar.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  const filtrados = productos.filter(producto => {
    // includes() revisa si el nombre CONTIENE el texto buscado.
    const coincideTexto = producto.nombre.toLowerCase().includes(texto);
    // Si el filtro es "todos", cualquier categoría pasa.
    const coincideCategoria = (categoria === "todos") || (producto.categoria === categoria);
    // Solo entra si cumple AMBAS condiciones (&&).
    return coincideTexto && coincideCategoria;
  });

  renderizarTabla(filtrados);
  actualizarEstadisticas();
}

/* ------------------------------------------------------------
   6. VALIDACIONES DEL FORMULARIO
   ------------------------------------------------------------ */

/**
 * Escribe (o borra) el mensaje de error de un campo.
 * @param {string} idCampo - "nombre", "precio", etc.
 * @param {string} mensaje - texto del error, o "" para limpiarlo
 */
function marcarError(idCampo, mensaje) {
  document.getElementById("error-" + idCampo).textContent = mensaje;
  const campo = document.getElementById(idCampo);

  // classList.toggle añade la clase si el segundo argumento es true
  // y la quita si es false. Aquí: hay mensaje => hay error.
  campo.classList.toggle("invalido", mensaje !== "");
}

/**
 * Revisa todos los campos.
 * @returns {boolean} true si todo está correcto
 */
function validarFormulario() {
  let valido = true;   // asumimos que está bien hasta encontrar un fallo

  // --- Nombre: obligatorio, mínimo 3 caracteres ---
  const nombre = inputNombre.value.trim();
  if (nombre.length < 3) {
    marcarError("nombre", "El nombre debe tener al menos 3 caracteres.");
    valido = false;
  } else {
    // Verificamos que no exista otro producto con el mismo nombre.
    // some() devuelve true si AL MENOS UNO cumple la condición.
    const idActual = inputId.value;   // vacío si es producto nuevo
    const repetido = productos.some(p =>
      p.nombre.toLowerCase() === nombre.toLowerCase() &&
      String(p.id) !== idActual       // se ignora a sí mismo al editar
    );
    if (repetido) {
      marcarError("nombre", "Ya existe un producto con ese nombre.");
      valido = false;
    } else {
      marcarError("nombre", "");      // limpia el error
    }
  }

  // --- Categoría: obligatoria ---
  if (inputCategoria.value === "") {
    marcarError("categoria", "Selecciona una categoría.");
    valido = false;
  } else {
    marcarError("categoria", "");
  }

  // --- Precio: número entero mayor que 0 ---
  // Number() convierte el texto del input a número.
  const precio = Number(inputPrecio.value);
  // isNaN = "is Not a Number": true si no se pudo convertir.
  if (inputPrecio.value === "" || isNaN(precio) || precio <= 0) {
    marcarError("precio", "Ingresa un precio mayor a 0.");
    valido = false;
  } else if (!Number.isInteger(precio)) {
    marcarError("precio", "El precio debe ser un número entero (sin decimales).");
    valido = false;
  } else {
    marcarError("precio", "");
  }

  // --- Stock: entero mayor o igual a 0 (0 = agotado, es válido) ---
  const stock = Number(inputStock.value);
  if (inputStock.value === "" || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    marcarError("stock", "Ingresa un stock entero de 0 o más.");
    valido = false;
  } else {
    marcarError("stock", "");
  }

  // --- Descripción: mínimo 10 caracteres ---
  if (inputDescripcion.value.trim().length < 10) {
    marcarError("descripcion", "La descripción debe tener al menos 10 caracteres.");
    valido = false;
  } else {
    marcarError("descripcion", "");
  }

  // --- Imagen: opcional, pero si se escribe debe parecer ruta o URL ---
  const imagen = inputImagen.value.trim();
  if (imagen !== "" && !/^(https?:\/\/|img\/|\.\/|\/)/i.test(imagen)) {
    // La expresión regular acepta http://, https://, img/, ./ o /
    marcarError("imagen", "Usa una URL (http...) o una ruta local (img/...).");
    valido = false;
  } else {
    marcarError("imagen", "");
  }

  return valido;
}

/* ------------------------------------------------------------
   7. ACCIONES: GUARDAR, EDITAR, ELIMINAR
   ------------------------------------------------------------ */

/**
 * Deja el formulario limpio y en modo "Nuevo producto".
 */
function limpiarFormulario() {
  form.reset();                 // borra todos los inputs de golpe
  inputId.value = "";           // reset no toca los hidden, lo hacemos a mano
  tituloForm.textContent = "Nuevo producto";
  previewImagen.src = IMAGEN_RESPALDO;

  // Limpia todos los mensajes de error que hubieran quedado.
  ["nombre", "categoria", "precio", "stock", "imagen", "descripcion"]
    .forEach(campo => marcarError(campo, ""));
}

/**
 * Se ejecuta al enviar el formulario (crear o actualizar).
 */
function manejarEnvio(evento) {
  // Sin esto el navegador recargaría la página y perderíamos todo.
  evento.preventDefault();

  // Si algo no pasa la validación, cortamos aquí.
  if (!validarFormulario()) {
    mostrarAviso("Revisa los campos marcados en rojo.", "error");
    return;
  }

  // Armamos el objeto con los datos ya limpios.
  const datos = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    precio: Number(inputPrecio.value),
    stock: Number(inputStock.value),
    descripcion: inputDescripcion.value.trim(),
    // Si no escribieron imagen, usamos el respaldo.
    imagen: inputImagen.value.trim() || IMAGEN_RESPALDO
  };

  if (inputId.value === "") {
    // ---- MODO CREAR ----
    datos.id = generarId();
    productos.push(datos);          // push agrega al final del array
    mostrarAviso("Producto creado correctamente.", "exito");
  } else {
    // ---- MODO EDITAR ----
    const id = Number(inputId.value);
    // findIndex devuelve la POSICIÓN del producto, o -1 si no existe.
    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
      mostrarAviso("No se encontró el producto que intentas editar.", "error");
      return;
    }

    // Conservamos el id original y reemplazamos el resto de los datos.
    productos[indice] = { id: id, ...datos };
    mostrarAviso("Producto actualizado correctamente.", "exito");
  }

  guardarProductos();   // persistimos en localStorage
  aplicarFiltros();     // redibujamos la tabla y las estadísticas
  limpiarFormulario();  // dejamos el formulario listo para el siguiente
}

/**
 * Carga un producto dentro del formulario para editarlo.
 */
function editarProducto(id) {
  // find devuelve el OBJETO completo (a diferencia de findIndex).
  const producto = productos.find(p => p.id === id);
  if (!producto) return;   // seguridad: si no existe, no hace nada

  inputId.value          = producto.id;
  inputNombre.value      = producto.nombre;
  inputCategoria.value   = producto.categoria;
  inputPrecio.value      = producto.precio;
  inputStock.value       = producto.stock;
  inputImagen.value      = producto.imagen;
  inputDescripcion.value = producto.descripcion;
  previewImagen.src      = producto.imagen;

  tituloForm.textContent = "Editar producto: " + producto.nombre;

  // Sube la pantalla hasta el formulario con desplazamiento suave.
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Elimina un producto previa confirmación.
 */
function eliminarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // confirm muestra una ventana con Aceptar/Cancelar y devuelve true/false.
  const confirmado = confirm(`¿Eliminar "${producto.nombre}" del catálogo?`);
  if (!confirmado) return;

  // filter crea un array NUEVO sin el producto eliminado.
  productos = productos.filter(p => p.id !== id);

  guardarProductos();
  aplicarFiltros();
  mostrarAviso("Producto eliminado.", "exito");

  // Si estábamos editando justo ese producto, limpiamos el formulario.
  if (Number(inputId.value) === id) limpiarFormulario();
}

/* ------------------------------------------------------------
   8. EVENTOS
   ------------------------------------------------------------ */

// Envío del formulario (botón "Guardar producto" o tecla Enter).
form.addEventListener("submit", manejarEnvio);

// Botón Cancelar: descarta la edición.
btnCancelar.addEventListener("click", limpiarFormulario);

// Buscador y filtro: "input" se dispara con cada tecla,
// "change" cuando se elige otra opción del select.
inputBuscar.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);

// Vista previa en vivo mientras se escribe la URL de la imagen.
inputImagen.addEventListener("input", () => {
  previewImagen.src = inputImagen.value.trim() || IMAGEN_RESPALDO;
});

// Si la imagen de la vista previa no carga, mostramos el respaldo.
previewImagen.addEventListener("error", () => {
  previewImagen.src = IMAGEN_RESPALDO;
});

/* DELEGACIÓN DE EVENTOS
   Los botones Editar/Eliminar se crean y destruyen constantemente.
   En vez de ponerle un listener a cada uno, se lo ponemos UNA VEZ
   a la tabla completa y revisamos en qué botón se hizo clic. */
tabla.addEventListener("click", (evento) => {
  // closest sube por el HTML hasta encontrar un botón con data-accion.
  // Sirve por si el clic cae en el texto interno del botón.
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;   // el clic fue en otra parte de la fila

  // dataset lee los atributos data-* del HTML.
  const id = Number(boton.dataset.id);

  if (boton.dataset.accion === "editar") {
    editarProducto(id);
  } else if (boton.dataset.accion === "eliminar") {
    eliminarProducto(id);
  }
});

// Botón "Restablecer catálogo": vuelve a los 8 productos de ejemplo.
btnRestablecer.addEventListener("click", () => {
  const confirmado = confirm(
    "Esto borrará tus cambios y volverá al catálogo de ejemplo. ¿Continuar?"
  );
  if (!confirmado) return;

  productos = PRODUCTOS_INICIALES.map(p => ({ ...p }));
  guardarProductos();
  aplicarFiltros();
  limpiarFormulario();
  mostrarAviso("Catálogo restablecido.", "exito");
});

/* ------------------------------------------------------------
   9. ARRANQUE
   Estas tres líneas se ejecutan apenas se carga el archivo.
   ------------------------------------------------------------ */

productos = cargarProductos();  // trae los datos guardados
guardarProductos();             // los deja escritos (útil en la 1ª visita)
aplicarFiltros();               // dibuja tabla + estadísticas
limpiarFormulario();            // deja el formulario en blanco