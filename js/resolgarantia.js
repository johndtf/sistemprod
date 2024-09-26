const newButton = document.getElementById("newResolGarant-btn");
const cancelButton = document.getElementById("cancelResolGarant-btn");
const findButton = document.getElementById("findResolGarant-btn");
const modifyButton = document.getElementById("modifyResolGarant-btn");

const codeField = document.getElementById("resol-garantia-codigo");
const nameField = document.getElementById("resol-garantia-Description");
const idField = document.getElementById("resol-garantia-id");
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

/* ===========Botón agrega resolución de garantías=============================== */

newButton.addEventListener("click", () => {
  if (newButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos

    modifyButton.disabled = true;
    findButton.disabled = true;
    codeField.removeAttribute("readonly");
    codeField.value = "";
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    newButton.textContent = "Aceptar";
    newButton.classList.add("success-button");
    limpiarResultados();
    codeField.focus();
  } else {
    // Obtener código y nombre de la nueva resolución de garantía
    const nuevaResolGarant = {
      codigo: codeField.value,
      resol_garan: nameField.value,
    };

    /* Verifica que sea un código y descripción validos */
    if (!esCadenaNoVacia(nuevaResolGarant.codigo)) {
      errorMessage.textContent = "El código no puede ser vacío.";
      return;
    }

    if (!esCadenaNoVacia(nuevaResolGarant.resol_garan)) {
      errorMessage.textContent =
        "Se debe escribir la descripción de la resolución";
      return;
    }

    //Llama a la función para agregar la nueva dimension
    agregarResolgarant(nuevaResolGarant);
  }
});

/* =================Botón Buscar========================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar resoluciones
    restaurarValoresIniciales();
    codeField.removeAttribute("readonly");
    nameField.removeAttribute("readonly");

    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    codeField.focus();
  } else {
    // Crea la variable con los parámetros de búsqueda
    const filtroResolucion = {
      codigo: codeField.value,
      resol_garan: nameField.value,
    };

    findResolutions(filtroResolucion);
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
    codeField.removeAttribute("readonly");
    nameField.removeAttribute("readonly");
    codeField.focus();
  } else {
    // Obtener el ID de la resolución de garantía y la nueva descripción
    const idResolGarant = parseInt(idField.value);
    const resolGarantModificada = {
      codigo: codeField.value,
      resol_garan: nameField.value,
    };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idResolGarant || !esCadenaNoVacia(resolGarantModificada.codigo)) {
      errorMessage.textContent =
        "Por favor, busque una resolución de garantía antes de modificar o ingrese un código válido.";
      return;
    }

    if (!esCadenaNoVacia(resolGarantModificada.resol_garan)) {
      errorMessage.textContent = "Por favor, ingrese una descripción válida";
    }

    actualizarDescripcionEnBaseDeDatos(idResolGarant, resolGarantModificada);
  }
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar resolución de garantía ------------------------
async function agregarResolgarant(nuevaResolgarant) {
  // Realizar una solicitud POST para crear la resolución de garantía

  try {
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/resolutionsWarranty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaResolgarant),
    });
    //console.log(response.status);

    if (response.status === 200) {
      // Éxito: resolución de garantía creada

      restaurarValoresIniciales();
      mostrarResultados("Resolución de garantía creada con éxito.");
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);

    errorMessage.textContent =
      "Ocurrió un error de red al crear la resolución de garantía.";
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

/*---------- Función para buscar resoluciones de garantía en la base de datos ------------*/
async function findResolutions(filtroResolucion) {
  try {
    // Realiza una solicitud al servidor para obtener la lista de resoluciones
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(
      `${apiUrl}/api/resolutionsWarranty/resolutionslist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filtroResolucion),
      }
    );

    if (response.status === 200) {
      // carga la información en la tabla del formulario
      const listaresoluciones = await response.json();

      //Limpia el contenido de la tabla
      cleanTable(tableBody);
      //Carga el contenido de la consulta en la tabla
      listaresoluciones.forEach((listaresolucion) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${listaresolucion.id_resol_g}</td>
    <td>${listaresolucion.codigo}</td>
    <td>${listaresolucion.resol_garan}</td>
  `;
        tableBody.appendChild(row);
      });
      table.style.display = "table";
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al hacer la consulta, Por favor verifica tu conexión a Internet.";
  }
}

/* -----------------Función Actualizar la descripción de la resolución de garantía------------ */

async function actualizarDescripcionEnBaseDeDatos(
  idResolgarant,
  resolGarantModificada
) {
  try {
    // Realiza una solicitud PATCH para modificar la resolución de garantía
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(
      `${apiUrl}/api/resolutionsWarranty/${idResolgarant}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resolGarantModificada),
      }
    );

    if (response.status === 200) {
      // Éxito: resolución de garantía modificada
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(
        `Resolución modificada: ${resolGarantModificada.resol_garan}`
      );
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al modificar la resolución";
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
    codeField.value = rowData[1];
    nameField.value = rowData[2];

    // Habilitar el botón de modificar si ya se seleccionó un cliente
    modifyButton.disabled = false;
  }
});

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  codeField.value = "";
  nameField.value = "";
  codeField.setAttribute("readonly", "");
  nameField.setAttribute("readonly", "");
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
