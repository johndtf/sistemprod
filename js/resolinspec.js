const newButton = document.getElementById("newResolinsp-btn");
const cancelButton = document.getElementById("cancelResolinsp-btn");
const findButton = document.getElementById("findResolinsp-btn");
const modifyButton = document.getElementById("modifyResolinsp-btn");

const codeField = document.getElementById("resol-insp-codigo");
const nameField = document.getElementById("resolinspDescription");
const idField = document.getElementById("resolinsp-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const table = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia, cleanTable } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega resolución de inspección=============================== */

newButton.addEventListener("click", () => {
  if (newButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
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
    // Obtener código y nombre de la nueva resolución de inspección
    const nuevaResolinsp = {
      codigo: codeField.value,
      resol_inspec: nameField.value,
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
    // Obtener el ID de la resolución de inspección y la nueva descripción
    const idResolinsp = parseInt(idField.value);
    const resolinspModificada = {
      codigo: codeField.value,
      resol_inspec: nameField.value,
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

/*---------- Función para buscar resoluciones de garantía en la base de datos ------------*/
async function findResolutions(filtroResolucion) {
  try {
    // Realiza una solicitud al servidor para obtener la lista de resoluciones
    const response = await fetch(
      `${apiUrl}/api/resolutionsInsp/resolutionslist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <td>${listaresolucion.id_inspec}</td>
    <td>${listaresolucion.codigo}</td>
    <td>${listaresolucion.resol_inspec}</td>
  `;
        tableBody.appendChild(row);
      });
      table.style.display = "table";
    } else if (response.status === 400) {
      errorMessage.textContent =
        "Por favor, proporciona información válida para la búsqueda.";
    } else {
      // Otro error en el servidor
      errorMessage.textContent =
        "Ocurrió un error en el servidor al hacer la consulta.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al hacer la consulta. Por favor, verifica tu conexión a Internet.";
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
