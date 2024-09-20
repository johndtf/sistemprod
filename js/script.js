const hero = document.querySelector(".hero");
const frameContainer = document.getElementById("frame-container");
const tabsMenu = document.getElementById("tabs-menu");

const tab1 = document.getElementById("tab-1");
const tab2 = document.getElementById("tab-2");
const tab3 = document.getElementById("tab-3");
const tab4 = document.getElementById("tab-4");
const tab5 = document.getElementById("tab-5");
const tab6 = document.getElementById("tab-6");

const usernameField = document.getElementById("login");
const passwordField = document.getElementById("password");

//Form para mensajes de error
const errorMessageForm = document.getElementById("error-message");
const errorTitle = document.querySelector(".title-error");
const errorContent = document.querySelector(".content-error");

import apiUrl from "./config.js";

// Cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  //verificar el Token de autenticación

  //Obtener token desde el local storage;
  const tokenFromLocalStorage = localStorage.getItem("myTokenName");
  if (tokenFromLocalStorage) {
    // Ya hay un token almacenado, no mostrar el formulario de login

    modalIngreso.style.display = "none";
  } else {
    usernameField.focus();
  }
});

/*--------------Función Obtener Token desde Cookie------------------*/
/* function obtenerTokenDesdeCookie() {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "myTokenName") {
      return value;
    }
  }
  return null;
} */

/* =================Menú Hamburguesa========================0 */
document.querySelector(".bars-menu").addEventListener("click", animateBars);

let line1_bars = document.querySelector(".line1-bars-menu");
let line2_bars = document.querySelector(".line2-bars-menu");
let line3_bars = document.querySelector(".line3-bars-menu");

function animateBars() {
  line1_bars.classList.toggle("active-line1-bars-menu");
  line2_bars.classList.toggle("active-line2-bars-menu");
  line3_bars.classList.toggle("active-line3-bars-menu");

  tabsMenu.classList.toggle("active");
}

//=====================Función para cargar páginas en la página  principal===================
// Cargar una página web dentro de un iframe.
function loadPage(pageURL) {
  // Asigna la URL de la página al atributo src del elemento frameContainer.
  frameContainer.src = pageURL;
  // Oculta el elemento con la clase "hero" al agregar la clase "hidden".
  hero.classList.add("hidden");
  // Hace visible el elemento con la clase "frameContainer" al agregar la clase "visible".
  frameContainer.classList.add("visible");
}

//==========================Función para regresar a la página de inicio==========================================

function loadInicio() {
  /*  frameContainer.scr = " "; */
  hero.classList.remove("hidden");
  frameContainer.classList.remove("visible");
}

//================ Ocultar el menú tabs-menu, devolver animación del  menú de hamburguesa  ===========================
function hideTabsMenu() {
  tabsMenu.classList.remove("active");
  line1_bars.classList.remove("active-line1-bars-menu");
  line2_bars.classList.remove("active-line2-bars-menu");
  line3_bars.classList.remove("active-line3-bars-menu");
}

// =====================Asignar eventos a los radio buttons=====================================
tab1.addEventListener("click", function () {
  loadInicio();
  hideTabsMenu();
});

tab2.addEventListener("click", function () {
  loadPage("html/produccion/menu_produccion.html");
  hideTabsMenu();
});

tab3.addEventListener("click", function () {
  hideTabsMenu();
  loadPage("html/ventas/menu_ventas.html");
});

tab4.addEventListener("click", function () {
  hideTabsMenu();
  loadPage("html/consultas/menu_consultas.html");
});

tab5.addEventListener("click", function () {
  hideTabsMenu();
  loadPage("html/catalogos/menu_catalogos.html");
});

tab6.addEventListener("click", function () {
  loadPage("html/contacto.html");
  hideTabsMenu();
});

//===============form ingreso de contraseña=========================

//trae del document el formulario y el boton submit en variables
const modalIngreso = document.getElementById("modal-ingreso");
const submitBtn = document.getElementById("submit-btn");

//en evento clic del botón submit

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // Evita el envío del formulario

  const username = usernameField.value;
  const password = passwordField.value;

  // Validaciones
  if (!(username && password)) {
    // Indicar que los campos son obligatorios
    errorTitle.textContent = "Información Incompleta";
    errorContent.textContent = "Por favor, completa todos los campos";
    return (errorMessageForm.style.display = "block");
  }

  // Validar el formato del correo electrónico
  if (!isValidEmail(username)) {
    errorTitle.textContent = "Información Incorrecta";
    errorContent.textContent =
      "Por favor, ingresa un correo electrónico válido en el campo Usuario.";
    errorMessageForm.style.display = "block";
    //usernameField.focus();
    return;
  }

  try {
    //Enviar usuario y password
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: username,
        password: password,
      }),
      //credentials: "include", // Importante para permitir cookies en la solicitud
    });

    //Procesar la respuesta

    if (response.ok) {
      // Validación exitosa, ocultar el formulario modal
      modalIngreso.style.display = "none";

      // Almacenar el token en el Local Storage
      const token = await response.json();
      localStorage.setItem("myTokenName", token);
    } else {
      //manejo de errores
      const errorMessage = await response.json();
      errorTitle.textContent = "Error de Identificación";
      errorContent.textContent = errorMessage.message;
      errorMessageForm.style.display = "block";
    }
  } catch (error) {
    console.error("Error al autenticar Empleado:", error);
    errorTitle.textContent = "Error al procesar la Solicitud";
    errorContent.textContent = error.json();
  }
});

/* mostrar el formulario de recuperar contraseña desde el botón de recuperar contraseña */

const btnRecuperar = document.getElementById("btnRecuperar");
const modalRecuperar = document.getElementById("modal-recuperar-contrasena");

btnRecuperar.addEventListener("click", () => {
  modalRecuperar.style.display = "block";
});

//================Form recuperar contraseña===================================

// Obtener referencia al botón de generación de pin
const generatePinBtn = document.querySelector(".generate-btn");
const emailInput = document.getElementById("username-recovery");

// Agregar un event listener al botón generar pin
generatePinBtn.addEventListener("click", async () => {
  // Obtener el valor del campo de correo electrónico
  const email = emailInput.value.trim();

  // Validar el formato del correo electrónico
  if (!isValidEmail(email)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }

  try {
    // Enviar la solicitud a la API para generar el pin
    const response = await fetch(`${apiUrl}/api/auth/recover-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    // Procesar la respuesta
    if (response.ok) {
      alert(
        "Se ha generado un pin. Revise su correo electrónico para obtener más instrucciones."
      );
    } else {
      // Manejar posibles errores
      const errorMessage = await response.text();
      alert(`Error al establecer la nueva contraseña: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error en la solicitud de generación de pin:", error);
    alert(
      "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo."
    );
  }
});

// -Botón Aceptar para cambio de contraseña
const newPasswordButton = document.getElementById("nuevaClave-btn");

newPasswordButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const recoveryCode = document.getElementById("password-recuperar").value;
  const newPassword1 = document.getElementById("nuevaClave1").value;
  const newPassword2 = document.getElementById("nuevaClave2").value;

  // Verificar que las nuevas contraseñas coincidan
  if (newPassword1 !== newPassword2) {
    alert("Las nuevas contraseñas no coinciden");

    return;
  }

  // Realizar una solicitud al servidor para restablecer la contraseña
  const newPassword = {
    email: email,
    recoveryCode: recoveryCode,
    newPassword: newPassword1,
  };
  try {
    const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newPassword),
    });

    // Procesar la respuesta
    if (response.ok) {
      alert(
        "Se ha reestablecido la contraseña, en este momento puede ingresar con ella al sistema"
      );
      modalRecuperar.style.display = "none";
    } else {
      // Manejar posibles errores
      const errorMessage = await response.text();
      alert(`Error al establecer la nueva contraseña: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Error en la solicitud de generación de pin:", error);
    alert(
      "Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo."
    );
  }
});

/*====================================Form Error=======================*/
// Obtener el botón de aceptar del mensaje de error
const errorButton = document.getElementById("error-button");

// Agregar un evento de clic al botón de aceptar
errorButton.addEventListener("click", async () => {
  errorMessageForm.style.display = "none";
});

// -------Función para validar el formato de un correo electrónico------
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
