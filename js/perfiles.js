const newProfileButton = document.getElementById("newProfile-btn");
const cancelButton = document.getElementById("cancelProfile-btn");
const findProfileButton = document.getElementById("findProfile-btn");
const modifyProfileButton = document.getElementById("modifyProfile-btn");
const listProfileButton = document.getElementById("listProfile-btn");
const profileNameLabel = document.getElementById("profileNameLabel");
const profileNameField = document.getElementById("profileName");
const profileDescriptionField = document.getElementById("profileDescription");
const profileIdField = document.getElementById("profile-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableProfiles = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega perfil=============================== */

newProfileButton.addEventListener("click", () => {
  if (newProfileButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyProfileButton.disabled = true;
    findProfileButton.disabled = true;
    profileNameField.removeAttribute("readonly");
    profileDescriptionField.removeAttribute("readonly");
    profileNameField.value = ""; // Limpiar el valor del campo
    profileDescriptionField.value = "";
    newProfileButton.textContent = "Aceptar";
    newProfileButton.classList.add("success-button");
    limpiarResultados();
    profileNameField.focus();
  } else {
    // Obtener la información del nuevo perfil
    const nuevoPerfil = {
      perfil: profileNameField.value,
      descripcion: profileDescriptionField.value,
    };

    /* Verifica que sea un nombre y descripción validos */
    if (!esCadenaNoVacia(nuevoPerfil.perfil)) {
      errorMessage.textContent =
        "El perfil debe contener una cadena de caractéres no vacía.";
      return;
    }
    if (!esCadenaNoVacia(nuevoPerfil.descripcion)) {
      errorMessage.textContent =
        "La descripción del perfil debe contener una cadena de caractéres no vacía.";
      return;
    }

    //Llama a la función para agregar el nuevo perfil
    agregarPerfil(nuevoPerfil);
  }
});

/* =================Botón Encontrar========================== */
findProfileButton.addEventListener("click", () => {
  if (findProfileButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar un perfil
    profileNameField.removeAttribute("readonly");
    profileNameLabel.textContent = "Digita el id del Perfil";
    profileNameField.value = ""; // Limpiar el valor del campo
    profileDescriptionField.value = "";
    limpiarResultados(); // Ocultar resultados anteriores

    findProfileButton.textContent = "Aceptar";
    newProfileButton.disabled = true;
    modifyProfileButton.disabled = true;
    findProfileButton.classList.add("success-button");
    profileNameField.focus();
  } else {
    // Obtener nombre del perfil
    const nombrePerfil = profileNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nombrePerfil)) {
      errorMessage.textContent =
        "El perfil debe contener una cadena de caractéres no vacía.";
      return;
    }

    buscarPerfilEnBaseDeDatos(nombrePerfil);
  }
});

/* ============Botón Modificar==================================== */
modifyProfileButton.addEventListener("click", () => {
  if (modifyProfileButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newProfileButton.disabled = true;
    findProfileButton.disabled = true;
    modifyProfileButton.textContent = "Aceptar";
    modifyProfileButton.classList.add("success-button");
    profileNameField.removeAttribute("readonly");
    profileDescriptionField.removeAttribute("readonly");
    profileNameField.focus();
  } else {
    // Obtener la información del perfil modificado
    const idPerfil = parseInt(profileIdField.value);
    const perfilModificado = {
      perfil: profileNameField.value,
      descripcion: profileDescriptionField.value,
    };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idPerfil || !esCadenaNoVacia(perfilModificado.perfil)) {
      errorMessage.textContent =
        "Por favor, busque un nuevo perfil antes de modificar o ingrese un nombre válido.";
      return;
    }
    if (!esCadenaNoVacia(perfilModificado.descripcion)) {
      errorMessage.textContent = "Por favor, ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idPerfil, perfilModificado);
  }
});

/* ===========Botón Listado de Perfiles ============================ */
listProfileButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/profiles`);
  const perfiles = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  perfiles.forEach((perfil) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${perfil.id_perfil}</td>
    <td>${perfil.perfil}</td>
    <td>${perfil.descripcion}</td>

  `;
    tableBody.appendChild(row);
  });
  tableProfiles.style.display = "table";
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar perfil ------------------------
async function agregarPerfil(nuevoPerfil) {
  // Realizar una solicitud POST para crear el perfil

  try {
    const response = await fetch(`${apiUrl}/api/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoPerfil),
    });

    if (response.status === 200) {
      // Éxito: perfil creado

      restaurarValoresIniciales();
      mostrarResultados("Perfil creado con éxito.");
    } else if (response.status === 400) {
      // el perfil ya existe
      errorMessage.textContent = "El perfil ya existe.";
    } else {
      // Otro error
      errorMessage.textContent = "Ocurrió un error al crear el perfil.";
    }
  } catch (error) {
    //console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear el perfil.";
  }
}

/* ----------Función para mostrar los resultados positivos de acciones -----------*/
function mostrarResultados(resultados) {
  succesResults.style.display = "block"; // Mostrar los resultados
  succesResults.innerHTML = resultados;
  errorMessage.textContent = "";
}

/*----------- Función para limpiar los resultados -----------------------*/
function limpiarResultados() {
  succesResults.style.display = "none"; // Ocultar resultados
  succesResults.innerHTML = ""; // Limpiar resultados anteriores
}

/*---------- Función para buscar el perfil por id en la base de datos ------------*/
async function buscarPerfilEnBaseDeDatos(idPerfil) {
  try {
    // Realiza una solicitud al servidor para buscar el perfil
    const response = await fetch(`${apiUrl}/api/profiles/${idPerfil}`);

    if (response.status === 200) {
      const perfilEncontrado = await response.json();

      // Muestra el perfil encontrada

      console.log(perfilEncontrado);

      // Modifica la pantalla con el perfil encontrada
      restaurarValoresIniciales();
      profileNameField.value = perfilEncontrado.perfil;
      profileDescriptionField.value = perfilEncontrado.descripcion;
      profileIdField.value = perfilEncontrado.id_perfil;
      mostrarResultados(`Perfil encontrado: ${perfilEncontrado.perfil}`);
      modifyProfileButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `El perfil con id: ${idPerfil} no fue encontrado`;
    } else {
      errorMessage.textContent = "Ocurrió un error al obtener el perfil";
      console.error("Error al obtener el perfil:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al buscar el perfil.";
  }
}

/* -----------------Función Actualizar la descripción de el perfil------------ */

async function actualizarDescripcionEnBaseDeDatos(idPerfil, perfilModificado) {
  try {
    // Realiza una solicitud PATCH para modificar el perfil
    const response = await fetch(`${apiUrl}/api/profiles/${idPerfil}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(perfilModificado),
    });

    if (response.status === 200) {
      // Éxito: perfil modificado
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(`Perfil modificado: ${perfilModificado.perfil}`);
    } else if (response.status === 404) {
      // Error: perfil no encontrado
      errorMessage.textContent = "Perfil no encontrada. Verifique el ID.";
    } else if (response.status === 400) {
      // Error de validación u otro error
      errorMessage.textContent =
        "Esta descripción de perfil ya está siendo usada.";
    } else {
      // Otro error
      console.error("Error al actualizar el perfil:", error);
      errorMessage.textContent = "Ocurrió un error al modificar el perfil.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el empleado.");
  }
}

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  profileNameLabel.textContent = "Nombre:";
  profileNameField.value = "";
  profileDescriptionField.value = "";
  profileNameField.setAttribute("readonly", "");
  profileDescriptionField.setAttribute("readonly", "");
  newProfileButton.textContent = "Agregar";
  findProfileButton.textContent = "Buscar";
  modifyProfileButton.textContent = "Modificar";
  findProfileButton.disabled = false;
  newProfileButton.disabled = false;
  modifyProfileButton.disabled = true; // deshabilita el botón de modificar
  newProfileButton.classList.remove("success-button");
  findProfileButton.classList.remove("success-button");
  modifyProfileButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableProfiles.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
