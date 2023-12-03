const newResolinspButton = document.getElementById("newResolinsp-btn");
const cancelButton = document.getElementById("cancelResolinsp-btn");
const findResolinspButton = document.getElementById("findResolinsp-btn");
const modifyResolinspButton = document.getElementById("modifyResolinsp-btn");
const listResolinspButton = document.getElementById("listResolinsp-btn");
const resolinspCodeField = document.getElementById("resol-insp-codigo");
const resolinspDescriptionField = document.getElementById(
  "resolinspDescription"
);
const resolinspIdField = document.getElementById("resolinsp-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableResolinsps = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega resolución de inspección=============================== */

newResolinspButton.addEventListener("click", () => {
  if (newResolinspButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyResolinspButton.disabled = true;
    findResolinspButton.disabled = true;
    resolinspCodeField.removeAttribute("readonly");
    resolinspCodeField.value = "";
    resolinspDescriptionField.removeAttribute("readonly");
    resolinspDescriptionField.value = ""; // Limpiar el valor del campo
    newResolinspButton.textContent = "Aceptar";
    newResolinspButton.classList.add("success-button");
    limpiarResultados();
    resolinspCodeField.focus();
  } else {
    // Obtener código y nombre de la nueva resolución de inspección
    const nuevaResolinsp = {
      codigo: resolinspCodeField.value,
      resol_inspec: resolinspDescriptionField.value,
    };

    /* Verifica que sea un código y descripción validos */
    if (!esCadenaNoVacia(nuevaResolinsp.codigo)) {
      errorMessage.textContent = "El código no puede ser vacío.";
      return;
    }

    if (!esCadenaNoVacia(nuevaResolinsp.resol_inspec)) {
      errorMessage.textContent =
        "Se debe escribir la descripción de la resolución";
      return;
    }

    //Llama a la función para agregar la nueva dimension
    agregarResolinsp(nuevaResolinsp);
  }
});

/* =================Botón Encontrar========================== */
findResolinspButton.addEventListener("click", () => {
  if (findResolinspButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una dimension
    resolinspCodeField.removeAttribute("readonly");
    resolinspCodeField.value = "";
    limpiarResultados(); // Ocultar resultados anteriores

    findResolinspButton.textContent = "Aceptar";
    newResolinspButton.disabled = true;
    modifyResolinspButton.disabled = true;
    findResolinspButton.classList.add("success-button");
    resolinspCodeField.focus();
  } else {
    // Obtener nombre y código de la resolución
    const codigoResolinsp = resolinspCodeField.value;

    /* Verifica que sea un código valido */
    if (!esCadenaNoVacia(codigoResolinsp)) {
      errorMessage.textContent =
        "El código de la resolución deben contener información.";
      return;
    }

    buscarResolinspEnBaseDeDatos(codigoResolinsp);
  }
});

/* ============Botón Modificar==================================== */
modifyResolinspButton.addEventListener("click", () => {
  if (modifyResolinspButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newResolinspButton.disabled = true;
    findResolinspButton.disabled = true;
    modifyResolinspButton.textContent = "Aceptar";
    modifyResolinspButton.classList.add("success-button");
    resolinspCodeField.removeAttribute("readonly");
    resolinspDescriptionField.removeAttribute("readonly");
    resolinspCodeField.focus();
  } else {
    // Obtener el ID de la resolución de inspección y la nueva descripción
    const idResolinsp = parseInt(resolinspIdField.value);
    const resolinspModificada = {
      codigo: resolinspCodeField.value,
      resol_inspec: resolinspDescriptionField.value,
    };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idResolinsp || !esCadenaNoVacia(resolinspModificada.codigo)) {
      errorMessage.textContent =
        "Por favor, busque una resolución de inspección antes de modificar o ingrese un código válido.";
      return;
    }

    if (!esCadenaNoVacia(resolinspModificada.resol_inspec)) {
      errorMessage.textContent = "Por favor, ingrese una descripción válida";
    }

    actualizarDescripcionEnBaseDeDatos(idResolinsp, resolinspModificada);
  }
});

/* ===========Botón Listado de Resoluciones de inspección ============================ */
listResolinspButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/resolutionsInsp`);
  const resolinsp = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  resolinsp.forEach((resolinsp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${resolinsp.id_inspec}</td>
    <td>${resolinsp.codigo}</td>
    <td>${resolinsp.resol_inspec}</td>
  `;
    tableBody.appendChild(row);
  });
  tableResolinsps.style.display = "table";
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar resolución de inspección ------------------------
async function agregarResolinsp(nuevaResolinsp) {
  // Realizar una solicitud POST para crear la resolución de inspección

  try {
    const response = await fetch(`${apiUrl}/api/resolutionsInsp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaResolinsp),
    });
    //console.log(response.status);

    if (response.status === 200) {
      // Éxito: resolución de inspección creada

      restaurarValoresIniciales();
      mostrarResultados("Resolución de inspección creada con éxito.");
    } else if (response.status === 400) {
      // La resolución de inspección o el código ya existe

      const error = await response.json();
      //muestra el mensaje enviado por la api, ya sea que el código o la descripción esté siendo usada
      errorMessage.textContent = error.message;
    } else {
      // Otro error
      console.log(response.status);
      errorMessage.textContent =
        "Ocurrió un error al crear la resolución de inspección.";
    }
  } catch (error) {
    console.error("Error de red:", error);

    errorMessage.textContent =
      "Ocurrió un error de red al crear la resolución de inspección.";
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

/*---------- Función para buscar la resolución de inspección en la base de datos ------------*/
async function buscarResolinspEnBaseDeDatos(codigoResolinsp) {
  try {
    // Realiza una solicitud al servidor para buscar la resolución de inspección por código
    const response = await fetch(
      `${apiUrl}/api/resolutionsInsp/${codigoResolinsp}`
    );

    if (response.status === 200) {
      const resolinspEncontrada = await response.json();

      // Muestra la resolución de inspección encontrada

      console.log(resolinspEncontrada);

      // Modifica la pantalla con la resolución de inspección encontrada
      restaurarValoresIniciales();
      resolinspCodeField.value = resolinspEncontrada.codigo;
      resolinspDescriptionField.value = resolinspEncontrada.resol_inspec;
      resolinspIdField.value = resolinspEncontrada.id_inspec;
      mostrarResultados(
        `Resolución encontrada: ${resolinspEncontrada.resol_inspec}`
      );
      modifyResolinspButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `La resolución de inspección código: ${codigoResolinsp} no fue encontrada`;
    } else {
      errorMessage.textContent =
        "Ocurrió un error al obtener la resolución de inspección";
      console.error("Error al obtener la resolución de inspección:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al buscar la resolución de inspección.";
  }
}

/* -----------------Función Actualizar la descripción de la resolución de inspección------------ */

async function actualizarDescripcionEnBaseDeDatos(
  idResolinsp,
  resolinspModificada
) {
  try {
    // Realiza una solicitud PATCH para modificar la resolución de inspección
    const response = await fetch(
      `${apiUrl}/api/resolutionsInsp/${idResolinsp}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resolinspModificada),
      }
    );

    if (response.status === 200) {
      // Éxito: resolución de inspección modificada
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(
        `Resolución modificada: ${resolinspModificada.resol_inspec}`
      );
    } else if (response.status === 404) {
      // Error: resolución de inspección no encontrada
      errorMessage.textContent = "Resolución no encontrada. Verifique el ID.";
    } else if (response.status === 400) {
      // La resolución de inspección o el código ya existe

      const error = await response.json();
      //muestra el mensaje enviado por la api, ya sea que el código o la descripción esté siendo usada
      errorMessage.textContent = error.message;
    } else {
      // Otro error
      console.error("Error al actualizar la resolución de inspección:", error);
      errorMessage.textContent =
        "Ocurrió un error al modificar la resolución de inspección.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar la resolución.");
  }
}

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  resolinspCodeField.value = "";
  resolinspDescriptionField.value = "";
  resolinspCodeField.setAttribute("readonly", "");
  resolinspDescriptionField.setAttribute("readonly", "");
  newResolinspButton.textContent = "Agregar";
  findResolinspButton.textContent = "Buscar";
  modifyResolinspButton.textContent = "Modificar";
  findResolinspButton.disabled = false;
  newResolinspButton.disabled = false;
  modifyResolinspButton.disabled = true; // deshabilita el botón de modificar
  newResolinspButton.classList.remove("success-button");
  findResolinspButton.classList.remove("success-button");
  modifyResolinspButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableResolinsps.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
