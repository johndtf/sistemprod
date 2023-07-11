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
function loadPage(pageURL) {
  frameContainer.src = pageURL;
  hero.classList.add("hidden");
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

/* btnRecuperar.addEventListener("click", (event) => {
  event.stopPropagation(); // Evita la propagación del evento
  modalRecuperar.style.display = "block";
}); */

/* mostrar el formulario de ingresar nuevo usuario desde el botón respectivo */

const btnRegister = document.getElementById("btnRegister");
const modalRegistro = document.getElementById("modal-nuevo-usuario");

btnRegister.addEventListener("click", () => {
  modalRegistro.style.display = "block";
});

//================Form recuperar contraseña===================================

// Boton Aceptar, solo salir del formulario, lo demás pendiente por programar

const btnAceptarNuevaClave = document.getElementById("nuevaClave-btn");
btnAceptarNuevaClave.addEventListener("click", () => {
  modalRecuperar.style.display = "none";
});
// ==============Form Ingresar Nuevo Usuario ======================================

// Agrega el evento para cerrar el modal de ingresar nuevo usuario al hacer clic en el botón de cierre

// Obtener el botón de cierre por su clase
const closeButton = document.querySelector(".close");

// Agregar un evento de clic al botón de cierre
closeButton.addEventListener("click", () => {
  modalRegistro.style.display = "none";
});

//Botón Aceptar, solo sale del formulario, pendiente el resto de programación
const btnAceptarNuevoUsuario = document.getElementById("nuevoUsuario-btn");
btnAceptarNuevoUsuario.addEventListener("click", () => {
  modalRegistro.style.display = "none";
});

/*====================Form Error=================0*/
// Obtener el botón de aceptar del mensaje de error
const errorButton = document.getElementById("error-button");

// Agregar un evento de clic al botón de aceptar
errorButton.addEventListener("click", () => {
  errorMessage.style.display = "none";
});
