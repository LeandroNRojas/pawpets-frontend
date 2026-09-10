// ===== VALIDACIONES DE FORMULARIOS (login, registro, checkout del carrito) =====

// Muestra un mensaje de error específico en el campo indicado
function mostrarError(inputId, errorId, mensaje) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  const campo = input.closest(".campo");
  error.textContent = mensaje;

  if (mensaje === "") {
    campo.classList.remove("invalido");
    campo.classList.add("valido");
  } else {
    campo.classList.remove("valido");
    campo.classList.add("invalido");
  }
}

function validarEmail(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(valor.trim());
}

document.addEventListener("DOMContentLoaded", function () {

  // ===== FORMULARIO DE LOGIN =====
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
      evento.preventDefault();
      let valido = true;

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (email.trim() === "") {
        mostrarError("login-email", "error-login-email", "El correo es obligatorio.");
        valido = false;
      } else if (!validarEmail(email)) {
        mostrarError("login-email", "error-login-email", "Ingresa un correo válido (ej: nombre@dominio.com).");
        valido = false;
      } else {
        mostrarError("login-email", "error-login-email", "");
      }

      if (password.trim() === "") {
        mostrarError("login-password", "error-login-password", "La contraseña es obligatoria.");
        valido = false;
      } else if (password.length < 6) {
        mostrarError("login-password", "error-login-password", "La contraseña debe tener al menos 6 caracteres.");
        valido = false;
      } else {
        mostrarError("login-password", "error-login-password", "");
      }

      const mensajeExito = document.getElementById("mensaje-login-exito");
      if (valido) {
        mensajeExito.textContent = "✓ Inicio de sesión exitoso. Redirigiendo...";
      } else {
        mensajeExito.textContent = "";
      }
    });
  }

  // ===== FORMULARIO DE REGISTRO =====
  const formRegistro = document.getElementById("form-registro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", function (evento) {
      evento.preventDefault();
      let valido = true;

      const nombre = document.getElementById("reg-nombre").value;
      const email = document.getElementById("reg-email").value;
      const telefono = document.getElementById("reg-telefono").value;
      const password = document.getElementById("reg-password").value;
      const password2 = document.getElementById("reg-password2").value;
      const terminos = document.getElementById("reg-terminos").checked;

      if (nombre.trim().length < 3) {
        mostrarError("reg-nombre", "error-reg-nombre", "Ingresa tu nombre completo (mínimo 3 letras).");
        valido = false;
      } else {
        mostrarError("reg-nombre", "error-reg-nombre", "");
      }

      if (!validarEmail(email)) {
        mostrarError("reg-email", "error-reg-email", "Ingresa un correo válido (ej: nombre@dominio.com).");
        valido = false;
      } else {
        mostrarError("reg-email", "error-reg-email", "");
      }

      const patronTelefono = /^[0-9+\s]{8,15}$/;
      if (!patronTelefono.test(telefono.trim())) {
        mostrarError("reg-telefono", "error-reg-telefono", "Ingresa un teléfono válido (solo números, 8 a 15 dígitos).");
        valido = false;
      } else {
        mostrarError("reg-telefono", "error-reg-telefono", "");
      }

      if (password.length < 6) {
        mostrarError("reg-password", "error-reg-password", "La contraseña debe tener al menos 6 caracteres.");
        valido = false;
      } else {
        mostrarError("reg-password", "error-reg-password", "");
      }

      if (password2 !== password || password2 === "") {
        mostrarError("reg-password2", "error-reg-password2", "Las contraseñas no coinciden.");
        valido = false;
      } else {
        mostrarError("reg-password2", "error-reg-password2", "");
      }

      const errorTerminos = document.getElementById("error-reg-terminos");
      if (!terminos) {
        errorTerminos.textContent = "Debes aceptar los términos y condiciones.";
        valido = false;
      } else {
        errorTerminos.textContent = "";
      }

      const mensajeExito = document.getElementById("mensaje-registro-exito");
      if (valido) {
        mensajeExito.textContent = "✓ Cuenta creada exitosamente. Ya puedes iniciar sesión.";
      } else {
        mensajeExito.textContent = "";
      }
    });
  }

  // ===== FORMULARIO DE CHECKOUT (CARRITO) =====
  const formCheckout = document.getElementById("form-checkout");
  if (formCheckout) {
    formCheckout.addEventListener("submit", function (evento) {
      evento.preventDefault();
      let valido = true;

      const nombre = document.getElementById("chk-nombre").value;
      const email = document.getElementById("chk-email").value;
      const direccion = document.getElementById("chk-direccion").value;
      const comuna = document.getElementById("chk-comuna").value;

      if (nombre.trim().length < 3) {
        mostrarError("chk-nombre", "error-chk-nombre", "Ingresa tu nombre completo.");
        valido = false;
      } else {
        mostrarError("chk-nombre", "error-chk-nombre", "");
      }

      if (!validarEmail(email)) {
        mostrarError("chk-email", "error-chk-email", "Ingresa un correo válido.");
        valido = false;
      } else {
        mostrarError("chk-email", "error-chk-email", "");
      }

      if (direccion.trim().length < 5) {
        mostrarError("chk-direccion", "error-chk-direccion", "Ingresa una dirección válida.");
        valido = false;
      } else {
        mostrarError("chk-direccion", "error-chk-direccion", "");
      }

      if (comuna.trim() === "") {
        mostrarError("chk-comuna", "error-chk-comuna", "La comuna es obligatoria.");
        valido = false;
      } else {
        mostrarError("chk-comuna", "error-chk-comuna", "");
      }

      const mensajeExito = document.getElementById("mensaje-checkout-exito");
      if (valido) {
        mensajeExito.textContent = "✓ Pedido confirmado. Te contactaremos pronto.";
      } else {
        mensajeExito.textContent = "";
      }
    });
  }

});