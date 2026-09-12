//codigo

document.addEventListener("DOMContentLoaded", function () {
  // 1. Obtener la sesión activa de localStorage
  const sesionActiva = JSON.parse(localStorage.getItem("sesionActiva"));

  // 2. Si hay un usuario logueado, modificar el menú superior
  if (sesionActiva) {
    const navUl = document.querySelector("header nav ul");

    if (navUl) {
      // Buscar los enlaces de Login y Registro por su href o posición
      const linkLogin = navUl.querySelector('a[href="login.html"]');
      const linkRegistro = navUl.querySelector('a[href="registro.html"]');

      // Ocultar o remover la opción de registro
      if (linkRegistro && linkRegistro.parentElement) {
        linkRegistro.parentElement.remove();
      }

      // Reemplazar la opción de "Iniciar sesión" por "Hola, Nombre" y añadir "Cerrar sesión"
      if (linkLogin && linkLogin.parentElement) {
        const liLogin = linkLogin.parentElement;
        
        // Extraer solo el primer nombre
        const primerNombre = sesionActiva.nombre ? sesionActiva.nombre.split(" ")[0] : "Usuario";

        liLogin.innerHTML = `
          <span style="color: #fff; margin-right: 0.5rem; font-weight: 600;">Hola, ${primerNombre}</span>
          <a href="#" id="btn-logout" style="color: var(--color-secundario, #ff7a00);">Cerrar sesión</a>
        `;
      }
    }
  }

  // 3. Escuchar el clic en el botón de Cerrar sesión (evento delegado)
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "btn-logout") {
      e.preventDefault();
      // Eliminar la sesión activa y recargar la página
      localStorage.removeItem("sesionActiva");
      window.location.reload();
    }
  });
});