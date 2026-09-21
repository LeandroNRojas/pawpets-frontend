/* ============================================================
   admin-usuarios.js
   CRUD de usuarios (administradores, vendedores, clientes)
   guardado en localStorage, siguiendo el mismo patrón que
   admin-productos.js.
   ============================================================ */
"use strict";

const CLAVE_STORAGE = "pawpets_usuarios";
const CLAVE_GUIA_OCULTA = "pawpets_admin_usuarios_guia_oculta";

const NOMBRES_TIPO = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente"
};

// Arreglo complementario de regiones y comunas (pedido por el enunciado).
const REGIONES_COMUNAS = {
  "Región Metropolitana de Santiago": ["Santiago", "Puente Alto", "Las Condes", "Maipú", "La Florida"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región del Maule": ["Talca", "Linares", "Curicó"],
  "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
  "Región de Ñuble": ["Chillán", "San Carlos", "Bulnes"],
  "Región de la Araucanía": ["Temuco", "Villarrica", "Angol"]
};

const USUARIOS_INICIALES = [
  { id: 1, run: "191110220", nombre: "Administrador", apellidos: "PawPets",
    correo: "admin@pawpets.cl", fechaNacimiento: "", tipo: "administrador",
    region: "Región Metropolitana de Santiago", comuna: "Santiago",
    direccion: "Casa matriz PawPets, Santiago" },
  { id: 2, run: "179654321", nombre: "Camila", apellidos: "Reyes Muñoz",
    correo: "camila.reyes@profesor.duoc.cl", fechaNacimiento: "1998-04-12", tipo: "vendedor",
    region: "Región de Valparaíso", comuna: "Viña del Mar",
    direccion: "Av. San Martín 456" },
  { id: 3, run: "205551234", nombre: "Matías", apellidos: "Contreras Silva",
    correo: "matias.contreras@gmail.com", fechaNacimiento: "2002-09-30", tipo: "cliente",
    region: "Región del Biobío", comuna: "Concepción",
    direccion: "Los Carrera 789, depto 3B" }
];

/* Referencias al HTML */
const form               = document.getElementById("form-usuario");
const inputId             = document.getElementById("usuario-id");
const inputRun            = document.getElementById("run");
const inputNombre         = document.getElementById("nombre");
const inputApellidos      = document.getElementById("apellidos");
const inputCorreo         = document.getElementById("correo");
const inputFechaNacimiento = document.getElementById("fecha-nacimiento");
const selectTipo          = document.getElementById("tipo-usuario");
const selectRegion        = document.getElementById("region");
const selectComuna        = document.getElementById("comuna");
const inputDireccion      = document.getElementById("direccion");
const tituloForm          = document.getElementById("titulo-form");
const btnToggleForm       = document.getElementById("btn-toggle-form");
const btnCancelar         = document.getElementById("btn-cancelar");
const contenedorTabla     = document.getElementById("contenedor-tabla");
const tabla               = document.getElementById("tabla-usuarios");
const estadoVacio         = document.getElementById("estado-vacio");
const mensajeVacio        = document.getElementById("mensaje-vacio");
const btnVacioAccion      = document.getElementById("btn-vacio-accion");
const contadorLista       = document.getElementById("contador-lista");
const aviso               = document.getElementById("aviso");
const inputBuscar         = document.getElementById("buscar");
const filtroTipo          = document.getElementById("filtro-tipo");
const guia                = document.getElementById("guia");
const btnCerrarGuia       = document.getElementById("btn-cerrar-guia");
const btnReabrirGuia      = document.getElementById("btn-reabrir-guia");

let usuarios = [];

/* ---------- Almacenamiento ---------- */
function cargarUsuarios() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (!guardado) return USUARIOS_INICIALES.map(u => ({ ...u }));
  try {
    const datos = JSON.parse(guardado);
    return Array.isArray(datos) ? datos : USUARIOS_INICIALES.map(u => ({ ...u }));
  } catch (error) {
    console.error("localStorage dañado, se usa el listado inicial:", error);
    return USUARIOS_INICIALES.map(u => ({ ...u }));
  }
}

function guardarUsuarios() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuarios));
}

function generarId() {
  if (usuarios.length === 0) return 1;
  return Math.max(...usuarios.map(u => u.id)) + 1;
}

/* ---------- Región / comuna en cascada ---------- */
function llenarRegiones() {
  Object.keys(REGIONES_COMUNAS).forEach(region => {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    selectRegion.appendChild(opcion);
  });
}

function llenarComunas(region, comunaSeleccionada) {
  selectComuna.innerHTML = "";

  if (!region || !REGIONES_COMUNAS[region]) {
    selectComuna.innerHTML = '<option value="">Primero selecciona una región</option>';
    selectComuna.disabled = true;
    return;
  }

  selectComuna.disabled = false;
  selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
  REGIONES_COMUNAS[region].forEach(comuna => {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    if (comuna === comunaSeleccionada) opcion.selected = true;
    selectComuna.appendChild(opcion);
  });
}

selectRegion.addEventListener("change", () => {
  llenarComunas(selectRegion.value, "");
});

/* ---------- Presentación ---------- */
function mostrarAviso(texto, tipo) {
  const icono = tipo === "exito" ? "✅" : "⚠️";
  aviso.innerHTML = `<span aria-hidden="true">${icono}</span> ${texto}`;
  aviso.className = "admin-aviso " + tipo;
  setTimeout(() => { aviso.className = "admin-aviso"; }, 3500);
}

/* ---------- Guía rápida ---------- */
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
  inputRun.focus();
}

function ocultarFormulario() {
  form.hidden = true;
  btnToggleForm.innerHTML = '<span aria-hidden="true">➕</span> Agregar usuario';
  limpiarFormulario();
}

btnToggleForm.addEventListener("click", () => {
  if (form.hidden) {
    mostrarFormulario();
  } else {
    ocultarFormulario();
  }
});

/* ---------- Dibujar tabla ---------- */
function renderizarTabla(lista) {
  tabla.innerHTML = "";

  const hayUsuariosEnTotal = usuarios.length > 0;
  const hayResultadosFiltrados = lista.length > 0;

  contenedorTabla.style.display = hayResultadosFiltrados ? "block" : "none";
  estadoVacio.style.display = hayResultadosFiltrados ? "none" : "block";

  if (!hayResultadosFiltrados) {
    if (hayUsuariosEnTotal) {
      mensajeVacio.textContent = "No hay usuarios que coincidan con tu búsqueda. Prueba con otro nombre, apellido o RUN.";
      btnVacioAccion.textContent = "Limpiar filtros";
    } else {
      mensajeVacio.textContent = "Todavía no has agregado ningún usuario.";
      btnVacioAccion.textContent = "Agregar mi primer usuario";
    }
    return;
  }

  lista.forEach(usuario => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td data-label="RUN">${usuario.run}</td>
      <td data-label="Nombre completo"><strong>${usuario.nombre} ${usuario.apellidos}</strong></td>
      <td data-label="Correo">${usuario.correo}</td>
      <td data-label="Tipo"><span class="admin-etiqueta">${NOMBRES_TIPO[usuario.tipo]}</span></td>
      <td data-label="Región / Comuna">${usuario.comuna}, ${usuario.region}</td>
      <td data-label="Acciones">
        <button type="button" class="btn-mini btn-editar"
                data-accion="editar" data-id="${usuario.id}">✏️ Editar</button>
        <button type="button" class="btn-mini btn-eliminar"
                data-accion="eliminar" data-id="${usuario.id}">🗑️ Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

function actualizarEstadisticas() {
  const admins = usuarios.filter(u => u.tipo === "administrador").length;
  const vendedores = usuarios.filter(u => u.tipo === "vendedor").length;

  document.getElementById("stat-total").textContent = usuarios.length;
  document.getElementById("stat-admins").textContent = admins;
  document.getElementById("stat-vendedores").textContent = vendedores;
}

function aplicarFiltros() {
  const texto = inputBuscar.value.trim().toLowerCase();
  const tipo = filtroTipo.value;

  const filtrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.toLowerCase();
    const coincideTexto = nombreCompleto.includes(texto) || usuario.run.toLowerCase().includes(texto);
    const coincideTipo = (tipo === "todos") || (usuario.tipo === tipo);
    return coincideTexto && coincideTipo;
  });

  contadorLista.textContent = `${filtrados.length} de ${usuarios.length} usuario(s)`;

  renderizarTabla(filtrados);
  actualizarEstadisticas();
}

btnVacioAccion.addEventListener("click", () => {
  if (usuarios.length > 0) {
    inputBuscar.value = "";
    filtroTipo.value = "todos";
    aplicarFiltros();
  } else {
    mostrarFormulario();
  }
});

/* ---------- Validaciones ---------- */
function marcarError(idCampo, mensaje) {
  const texto = mensaje ? `⚠️ ${mensaje}` : "";
  document.getElementById("error-" + idCampo).textContent = texto;
  document.getElementById(idCampo).classList.toggle("invalido", mensaje !== "");
}

// Verifica el dígito verificador de un RUN chileno (algoritmo módulo 11).
function validarDigitoRun(run) {
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1).toUpperCase();

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * Number(cuerpo[i]);
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

function validarCorreoDominio(valor) {
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patronEmail.test(valor.trim())) return false;
  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const correo = valor.trim().toLowerCase();
  return dominiosPermitidos.some(dominio => correo.endsWith(dominio));
}

function validarFormulario() {
  let valido = true;

  // RUN: requerido, sin puntos ni guion, entre 7 y 9 caracteres, dígito verificador correcto.
  const run = inputRun.value.trim().toUpperCase();
  if (run === "") {
    marcarError("run", "El RUN es obligatorio.");
    valido = false;
  } else if (run.length < 7 || run.length > 9) {
    marcarError("run", "El RUN debe tener entre 7 y 9 caracteres (sin puntos ni guion).");
    valido = false;
  } else if (!validarDigitoRun(run)) {
    marcarError("run", "El RUN ingresado no es válido.");
    valido = false;
  } else {
    const idActual = inputId.value;
    const repetido = usuarios.some(u => u.run === run && String(u.id) !== idActual);
    if (repetido) {
      marcarError("run", "Ya existe un usuario con ese RUN.");
      valido = false;
    } else {
      marcarError("run", "");
    }
  }

  // Nombre: requerido, máx 50.
  const nombre = inputNombre.value.trim();
  if (nombre === "") {
    marcarError("nombre", "El nombre es obligatorio.");
    valido = false;
  } else if (nombre.length > 50) {
    marcarError("nombre", "El nombre no puede superar los 50 caracteres.");
    valido = false;
  } else {
    marcarError("nombre", "");
  }

  // Apellidos: requerido, máx 100.
  const apellidos = inputApellidos.value.trim();
  if (apellidos === "") {
    marcarError("apellidos", "Los apellidos son obligatorios.");
    valido = false;
  } else if (apellidos.length > 100) {
    marcarError("apellidos", "Los apellidos no pueden superar los 100 caracteres.");
    valido = false;
  } else {
    marcarError("apellidos", "");
  }

  // Correo: requerido, máx 100, dominio permitido.
  const correo = inputCorreo.value.trim();
  if (correo === "") {
    marcarError("correo", "El correo es obligatorio.");
    valido = false;
  } else if (correo.length > 100) {
    marcarError("correo", "El correo no puede superar los 100 caracteres.");
    valido = false;
  } else if (!validarCorreoDominio(correo)) {
    marcarError("correo", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    valido = false;
  } else {
    marcarError("correo", "");
  }

  // Fecha de nacimiento: opcional, sin regla adicional.
  marcarError("fecha-nacimiento", "");

  // Tipo de usuario: requerido.
  if (selectTipo.value === "") {
    marcarError("tipo-usuario", "Selecciona un tipo de usuario.");
    valido = false;
  } else {
    marcarError("tipo-usuario", "");
  }

  // Región: requerida.
  if (selectRegion.value === "") {
    marcarError("region", "Selecciona una región.");
    valido = false;
  } else {
    marcarError("region", "");
  }

  // Comuna: requerida.
  if (selectComuna.value === "") {
    marcarError("comuna", "Selecciona una comuna.");
    valido = false;
  } else {
    marcarError("comuna", "");
  }

  // Dirección: requerida, máx 300.
  const direccion = inputDireccion.value.trim();
  if (direccion === "") {
    marcarError("direccion", "La dirección es obligatoria.");
    valido = false;
  } else if (direccion.length > 300) {
    marcarError("direccion", "La dirección no puede superar los 300 caracteres.");
    valido = false;
  } else {
    marcarError("direccion", "");
  }

  return valido;
}

/* ---------- Acciones ---------- */
function limpiarFormulario() {
  form.reset();
  inputId.value = "";
  tituloForm.textContent = "Nuevo usuario";
  llenarComunas("", "");
  ["run", "nombre", "apellidos", "correo", "fecha-nacimiento", "tipo-usuario", "region", "comuna", "direccion"]
    .forEach(campo => marcarError(campo, ""));
}

function manejarEnvio(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    mostrarAviso("Revisa los campos marcados en rojo antes de guardar.", "error");
    form.querySelector(".invalido")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const datos = {
    run: inputRun.value.trim().toUpperCase(),
    nombre: inputNombre.value.trim(),
    apellidos: inputApellidos.value.trim(),
    correo: inputCorreo.value.trim(),
    fechaNacimiento: inputFechaNacimiento.value,
    tipo: selectTipo.value,
    region: selectRegion.value,
    comuna: selectComuna.value,
    direccion: inputDireccion.value.trim()
  };

  const esNuevo = inputId.value === "";

  if (esNuevo) {
    datos.id = generarId();
    usuarios.push(datos);
  } else {
    const id = Number(inputId.value);
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice === -1) {
      mostrarAviso("No se encontró el usuario que intentas editar.", "error");
      return;
    }
    usuarios[indice] = { id: id, ...datos };
  }

  guardarUsuarios();
  aplicarFiltros();
  ocultarFormulario();

  mostrarAviso(
    esNuevo
      ? `"${datos.nombre} ${datos.apellidos}" se agregó al listado.`
      : `Los cambios en "${datos.nombre} ${datos.apellidos}" se guardaron.`,
    "exito"
  );
}

function editarUsuario(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  inputId.value = usuario.id;
  inputRun.value = usuario.run;
  inputNombre.value = usuario.nombre;
  inputApellidos.value = usuario.apellidos;
  inputCorreo.value = usuario.correo;
  inputFechaNacimiento.value = usuario.fechaNacimiento || "";
  selectTipo.value = usuario.tipo;
  selectRegion.value = usuario.region;
  llenarComunas(usuario.region, usuario.comuna);
  inputDireccion.value = usuario.direccion;

  tituloForm.textContent = "Editando: " + usuario.nombre + " " + usuario.apellidos;
  mostrarFormulario();
}

function eliminarUsuario(id) {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  const confirmado = confirm(
    `¿Eliminar a "${usuario.nombre} ${usuario.apellidos}" del listado?\n\nEsta acción no se puede deshacer.`
  );
  if (!confirmado) return;

  usuarios = usuarios.filter(u => u.id !== id);
  guardarUsuarios();
  aplicarFiltros();
  mostrarAviso(`"${usuario.nombre} ${usuario.apellidos}" se eliminó del listado.`, "exito");

  if (Number(inputId.value) === id) ocultarFormulario();
}

/* ---------- Eventos ---------- */
form.addEventListener("submit", manejarEnvio);
btnCancelar.addEventListener("click", ocultarFormulario);
inputBuscar.addEventListener("input", aplicarFiltros);
filtroTipo.addEventListener("change", aplicarFiltros);

tabla.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "editar") {
    editarUsuario(id);
  } else if (boton.dataset.accion === "eliminar") {
    eliminarUsuario(id);
  }
});

/* ---------- Arranque ---------- */
llenarRegiones();
llenarComunas("", "");
usuarios = cargarUsuarios();
guardarUsuarios();
inicializarGuia();
aplicarFiltros();