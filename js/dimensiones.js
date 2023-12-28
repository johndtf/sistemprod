const newButton = document.getElementById("newDimension-btn");
const cancelButton = document.getElementById("cancelDimension-btn");
const findButton = document.getElementById("findDimension-btn");
const modifyButton = document.getElementById("modifyDimension-btn");

const nameField = document.getElementById("dimensionName");
const idField = document.getElementById("dimension-id");

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

/* ===========Botón agrega dimensión=============================== */

newButton.addEventListener("click", () => {
  if (newButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyButton.disabled = true;
    findButton.disabled = true;
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    newButton.textContent = "Aceptar";
    newButton.classList.add("success-button");
    limpiarResultados();
    nameField.focus();
  } else {
    // Obtener nombre de la nueva dimensión
    const nuevaDimension = {
      dimension: nameField.value,
    };

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nuevaDimension.dimension)) {
      errorMessage.textContent =
        "La dimension debe contener una cadena de caractéres no vacía.";
      return;
    }

    //Llama a la función para agregar la nueva dimension
    agregarDimension(nuevaDimension);
  }
});

/* =================Botón Encontrar========================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una dimension
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    nameField.focus();
  } else {
    // Obtener  la dimension
    const nombreDimension = { dimension: nameField.value };

    buscarDimensionEnBaseDeDatos(nombreDimension);
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
    nameField.focus();
  } else {
    // Obtener el ID de la dimensión y la nueva descripción
    const idDimension = parseInt(idField.value);
    const nuevaDescripcion = { dimension: nameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idDimension || !esCadenaNoVacia(nuevaDescripcion.dimension)) {
      errorMessage.textContent =
        "Por favor, busque una dimensión antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idDimension, nuevaDescripcion);
  }
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar dimensión ------------------------
async function agregarDimension(nuevaDimension) {
  // Realizar una solicitud POST para crear la dimensión

  try {
    const response = await fetch(`${apiUrl}/api/dimensions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaDimension),
    });

    if (response.status === 200) {
      // Éxito: dimensión creada

      restaurarValoresIniciales();
      mostrarResultados("Dimensión creada con éxito.");
    } else if (response.status === 400) {
      // La dimensión ya existe
      errorMessage.textContent =
        "La nueva descripción ya está siendo utilizada. Por favor, elija otra.";
    } else {
      // Otro error
      errorMessage.textContent = "Ocurrió un error al crear la dimensión.";
    }
  } catch (error) {
    //console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear la dimensión.";
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

/*---------- Función para buscar la dimensión en la base de datos ------------*/
async function buscarDimensionEnBaseDeDatos(nombreDimension) {
  try {
    // Realiza una solicitud al servidor para buscar la dimensión
    //mediante POST ya que existen dimensiones que tienen el caracter /
    //y al enviar este caracter la api presenta error en el endpoint
    const response = await fetch(`${apiUrl}/api/dimensions/dimensionslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nombreDimension),
    });

    if (response.status === 200) {
      // carga la información en la tabla del formulario
      const datalist = await response.json();

      //Limpia el contenido de la tabla
      cleanTable(tableBody);
      //Carga el contenido de la consulta en la tabla
      datalist.forEach((dataelement) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${dataelement.id_dimension}</td>
    <td>${dataelement.dimension}</td>
    
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

/* -----------------Función Actualizar la descripción de la dimensión------------ */

async function actualizarDescripcionEnBaseDeDatos(
  idDimension,
  nuevaDescripcion
) {
  try {
    // Realiza una solicitud PATCH para modificar la dimensión
    const response = await fetch(`${apiUrl}/api/dimensions/${idDimension}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaDescripcion),
    });

    if (response.status === 200) {
      // Éxito: dimensión modificada
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(`Dimensión modificada: ${nuevaDescripcion.dimension}`);
    } else if (response.status === 404) {
      // Error: dimensión no encontrada
      errorMessage.textContent = "Dimensión no encontrada. Verifique el ID.";
    } else if (response.status === 400) {
      // Error de validación u otro error
      errorMessage.textContent =
        "Esta descripción de dimensión ya está siendo usada.";
    } else {
      // Otro error
      console.error("Error al actualizar la dimensión:", error);
      errorMessage.textContent = "Ocurrió un error al modificar la dimensión.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el empleado.");
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

    // Habilitar el botón de modificar
    modifyButton.disabled = false;
  }
});

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  nameField.value = "";
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
