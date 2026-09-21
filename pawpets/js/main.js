//codigo

function actualizarMenuSesion() {
  const sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"));

  if (sesionActiva) {
    const navUl = document.querySelector("header nav ul");

    if (navUl) {
        // Ubica los enlaces que deben reemplazarse cuando hay una sesión activa.
      const linkLogin = navUl.querySelector('a[href="login.html"]');
      const linkRegistro = navUl.querySelector('a[href="registro.html"]');

        // Un usuario autenticado ya no necesita ver la opción de registro.
      if (linkRegistro && linkRegistro.parentElement) {
        linkRegistro.parentElement.remove();
      }

        // Reemplaza el acceso al login por el saludo y la opción de cerrar sesión.
      if (linkLogin && linkLogin.parentElement) {
        const liLogin = linkLogin.parentElement;
        
          // Muestra solo el primer nombre para mantener compacto el encabezado.
        const primerNombre = sesionActiva.nombre ? sesionActiva.nombre.split(" ")[0] : "Usuario";

        liLogin.innerHTML = `
          <span style="color: #fff; margin-right: 0.5rem; font-weight: 600;">Hola, ${primerNombre}</span>
          <a href="#" id="btn-logout" style="color: var(--color-secundario, #ff7a00);">Cerrar sesión</a>
        `;

        // Si quien inició sesión es administrador, agrega un acceso directo al panel,
        // porque de otra forma no hay ninguna forma de llegar ahí desde la tienda.
        if (sesionActiva.rol === "administrador") {
          const liAdmin = document.createElement("li");
          liAdmin.innerHTML = '<a href="admin-dashboard.html" style="color: var(--color-primario, #ff8a3d); font-weight: 700;">Panel Admin</a>';
          navUl.insertBefore(liAdmin, liLogin);
        }
      }
    }
  }
}

function validarAccesoAdministrativo() {
  const paginaActual = window.location.pathname.split("/").pop();
  const esVistaAdministrativa = paginaActual.startsWith("admin-");
  const sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"));

    // Solo un usuario con rol administrador puede acceder a estas páginas.
  if (esVistaAdministrativa && (!sesionActiva || sesionActiva.rol !== "administrador")) {
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
    // Valida el acceso antes de habilitar las acciones de la página.
  validarAccesoAdministrativo();

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "btn-logout") {
      e.preventDefault();
      localStorage.removeItem("sesionActiva");
      window.location.reload();
    }
  });
});

// Hace que cualquier <textarea> del sitio crezca solo según el texto que se escribe,
// en vez de dejar que el usuario lo arrastre manualmente (evita que quede gigante y feo).
document.addEventListener("DOMContentLoaded", function () {
  const areasDeTexto = document.querySelectorAll("textarea");
  areasDeTexto.forEach(function (textarea) {
    function ajustarAltura() {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
    ajustarAltura();
    textarea.addEventListener("input", ajustarAltura);
  });
});

// Si se llega a Contacto desde un botón "¿Te interesa? Contáctanos" (?mascota=Nombre),
// precompleta el mensaje automáticamente y ajusta la altura del textarea.
document.addEventListener("DOMContentLoaded", function () {
  const parametros = new URLSearchParams(window.location.search);
  const mascota = parametros.get("mascota");
  const comentario = document.getElementById("cont-comentario");
 
  if (mascota && comentario) {
    comentario.value = `Hola, me interesa adoptar a ${mascota}. ¿Podrían darme más información?`;
    comentario.dispatchEvent(new Event("input"));
  }
});

//Funcion para replicar header en todas las paginas (excepto donde ya viene fijo, como el admin).
document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.querySelector('header');

  if (headerContainer && headerContainer.innerHTML.trim() === '') {
    fetch('header.html')
      .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el header');
        return response.text();
      })
      .then(data => {
        headerContainer.innerHTML = data;
        actualizarMenuSesion();
      })
      .catch(error => console.error('Error cargando el encabezado:', error));
  }
});