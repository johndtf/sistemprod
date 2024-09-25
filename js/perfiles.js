const newButton = document.getElementById("newProfile-btn");
const cancelButton = document.getElementById("cancelProfile-btn");
const findButton = document.getElementById("findProfile-btn");
const modifyButton = document.getElementById("modifyProfile-btn");

const nameField = document.getElementById("profileName");
const descriptionField = document.getElementById("profileDescription");
const idField = document.getElementById("profile-id");

const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const table = document.querySelector("table");

import apiUrl from "./config.js";
import {
  esCadenaNoVacia,
  cleanTable,
  handleErrorResponse,
} from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega perfil=============================== */

newButton.addEventListener("click", () => {
  if (newButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyButton.disabled = true;
    findButton.disabled = true;
    nameField.removeAttribute("readonly");
    descriptionField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    descriptionField.value = "";
    newButton.textContent = "Aceptar";
    newButton.classList.add("success-button");
    limpiarResultados();
    nameField.focus();
  } else {
    // Obtener la información del nuevo perfil
    const nuevoPerfil = {
      perfil: nameField.value,
      descripcion: descriptionField.value,
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

/* =================Botón Buscar========================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar un perfil
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    descriptionField.removeAttribute("readonly");
    descriptionField.value = "";
    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    nameField.focus();
  } else {
    // Obtener nombre del perfil

    const filtroPerfil = {
      perfil: nameField.value,
      descripcion: descriptionField.value,
    };

    buscarPerfilEnBaseDeDatos(filtroPerfil);
  }
});

/* ============Botón Modificar==================================== */
modifyButton.addEventListener("click", () => {
  if (modifyButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newButton.disabled = true;
    findButton.disabled = true;
    modifyButton.textContent = "Aceptar";
    modifyButton.classList.add("success-button");
    nameField.removeAttribute("readonly");
    descriptionField.removeAttribute("readonly");
    nameField.focus();
  } else {
    // Obtener la información del perfil modificado
    const idPerfil = parseInt(idField.value);
    const perfilModificado = {
      perfil: nameField.value,
      descripcion: descriptionField.value,
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

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar perfil ------------------------
async function agregarPerfil(nuevoPerfil) {
  // Realizar una solicitud POST para crear el perfil

  try {
    const token = localStorage.getItem("myTokenName");
    //console.log(token);
    const response = await fetch(`${apiUrl}/api/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoPerfil),
    });

    if (response.status === 200) {
      // Éxito: perfil creado

      restaurarValoresIniciales();
      mostrarResultados("Perfil creado con éxito.");
    } else {
      // Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage);
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

/*---------- Función para buscar el perfil en la base de datos ------------*/
async function buscarPerfilEnBaseDeDatos(filtroPerfil) {
  try {
    const token = localStorage.getItem("myTokenName");
    // Realiza una solicitud al servidor para obtener la lista de resoluciones
    const response = await fetch(`${apiUrl}/api/profiles/profileslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filtroPerfil),
    });

    if (response.status === 200) {
      // carga la información en la tabla del formulario
      const listaperfiles = await response.json();

      //Limpia el contenido de la tabla
      cleanTable(tableBody);
      //Carga el contenido de la consulta en la tabla
      listaperfiles.forEach((perfil) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${perfil.id_perfil}</td>
        <td>${perfil.perfil}</td>
        <td>${perfil.descripcion}</td>
         `;
        tableBody.appendChild(row);
      });
      table.style.display = "table";
    } else {
      // Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al hacer la consulta. Por favor, verifica tu conexión a Internet.";
  }
}
/* -----------------Función Actualizar la descripción de el perfil------------ */

async function actualizarDescripcionEnBaseDeDatos(idPerfil, perfilModificado) {
  try {
    // Realiza una solicitud PATCH para modificar el perfil
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/profiles/${idPerfil}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(perfilModificado),
    });

    if (response.status === 200) {
      // Éxito: perfil modificado
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(`Perfil modificado: ${perfilModificado.perfil}`);
    } else {
      // Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent(
      "Ocurrió un error de red al modificar el empleado."
    );
  }
}

/* --------------Función para poner el registro seleccionado en pantalla -------*/

// Añadir un evento de clic a las filas de la tabla
tableBody.addEventListener("click", (event) => {
  // Obtener el elemento padre (fila) más cercano desde el objetivo del evento
  const closestRow = event.target.closest("tr");

  // Verificar si se encontró una fila
  if (closestRow) {
    // Obtener los datos de la fila seleccionada
    const rowData = Array.from(closestRow.cells).map(
      (cell) => cell.textContent
    );

    // Elimina la clase 'selected' de otras filas si existe
    const filasSeleccionadas = table.querySelectorAll(".selected");
    filasSeleccionadas.forEach(function (filaSeleccionada) {
      filaSeleccionada.classList.remove("selected");
    });

    // Agrega la clase 'selected' a la fila actual

    closestRow.classList.add("selected");

    restaurarValoresIniciales();
    table.style.display = "table";

    // Llenar los campos del formulario con los datos obtenidos

    idField.value = rowData[0];
    nameField.value = rowData[1];
    descriptionField.value = rowData[2];

    // Habilitar el botón de modificar
    modifyButton.disabled = false;
  }
});
/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  profileNameLabel.textContent = "Nombre:";
  nameField.value = "";
  descriptionField.value = "";
  nameField.setAttribute("readonly", "");
  descriptionField.setAttribute("readonly", "");
  newButton.textContent = "Agregar";
  findButton.textContent = "Buscar";
  modifyButton.textContent = "Modificar";
  findButton.disabled = false;
  newButton.disabled = false;
  modifyButton.disabled = true; // deshabilita el botón de modificar
  newButton.classList.remove("success-button");
  findButton.classList.remove("success-button");
  modifyButton.classList.remove("success-button");
  errorMessage.textContent = "";
  table.style.display = "none";

  limpiarResultados();
}
