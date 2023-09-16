const hero = document.querySelector(".hero");
const frameContainer = document.getElementById("frame-container");
const tabsMenu = document.getElementById("tabs-menu");

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

//=====================Función para cargar páginas en la página principal===================
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

//===============form ingreso de contraseña=========================

//trae del document el formulario y el boton submit en variables
const modalIngreso = document.getElementById("modal-ingreso");
const submitBtn = document.getElementById("submit-btn");
const errorMessage = document.getElementById("error-message");

//en evento clic del botón submit sale del formulario modal dando paso a la página

submitBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Evita el envío del formulario

  const username = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    // Validación exitosa, ocultar el formulario modal

    modalIngreso.style.display = "none";
  } else {
    // Mostrar un mensaje de error o realizar alguna acción para indicar que los campos son obligatorios
    errorMessage.style.display = "block";
  }
});

/* mostrar el formulario de recuperar contraseña desde el botón de recuperar contraseña */

const btnRecuperar = document.getElementById("btnRecuperar");
const modalRecuperar = document.getElementById("modal-recuperar-contrasena");

btnRecuperar.addEventListener("click", () => {
  modalRecuperar.style.display = "block";
});

//================Form recuperar contraseña===================================

// Boton Aceptar, solo salir del formulario, lo demás pendiente por programar

const btnAceptarNuevaClave = document.getElementById("nuevaClave-btn");
btnAceptarNuevaClave.addEventListener("click", () => {
  modalRecuperar.style.display = "none";
});

/*====================Form Error=================0*/
// Obtener el botón de aceptar del mensaje de error
const errorButton = document.getElementById("error-button");

// Agregar un evento de clic al botón de aceptar
errorButton.addEventListener("click", () => {
  errorMessage.style.display = "none";
});
