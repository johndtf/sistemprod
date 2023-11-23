const newDimensionButton = document.getElementById("newDimension-btn");
const cancelButton = document.getElementById("cancelDimension-btn");
const findDimensionButton = document.getElementById("findDimension-btn");
const modifyDimensionButton = document.getElementById("modifyDimension-btn");
const listDimensionButton = document.getElementById("listDimension-btn");
const dimensionNameField = document.getElementById("dimensionName");
const dimensionIdField = document.getElementById("dimension-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableDimensions = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega dimensión=============================== */

newDimensionButton.addEventListener("click", () => {
  if (newDimensionButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyDimensionButton.disabled = true;
    findDimensionButton.disabled = true;
    dimensionNameField.removeAttribute("readonly");
    dimensionNameField.value = ""; // Limpiar el valor del campo
    newDimensionButton.textContent = "Aceptar";
    newDimensionButton.classList.add("success-button");
    limpiarResultados();
    dimensionNameField.focus();
  } else {
    // Obtener nombre de la nueva dimensión
    const nuevaDimension = {
      dimension: dimensionNameField.value,
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
findDimensionButton.addEventListener("click", () => {
  if (findDimensionButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una dimension
    dimensionNameField.removeAttribute("readonly");
    dimensionNameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findDimensionButton.textContent = "Aceptar";
    newDimensionButton.disabled = true;
    modifyDimensionButton.disabled = true;
    findDimensionButton.classList.add("success-button");
    dimensionNameField.focus();
  } else {
    // Obtener nombre de la dimension
    const nombreDimension = dimensionNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nombreDimension)) {
      errorMessage.textContent =
        "La dimension debe contener una cadena de caractéres no vacía.";
      return;
    }

    buscarDimensionEnBaseDeDatos(nombreDimension);
  }
});

/* ============Botón Modificar==================================== */
modifyDimensionButton.addEventListener("click", () => {
  if (modifyDimensionButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newDimensionButton.disabled = true;
    findDimensionButton.disabled = true;
    modifyDimensionButton.textContent = "Aceptar";
    modifyDimensionButton.classList.add("success-button");
    dimensionNameField.removeAttribute("readonly");
    dimensionNameField.focus();
  } else {
    // Obtener el ID de la dimensión y la nueva descripción
    const idDimension = parseInt(dimensionIdField.value);
    const nuevaDescripcion = { dimension: dimensionNameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idDimension || !esCadenaNoVacia(nuevaDescripcion.dimension)) {
      errorMessage.textContent =
        "Por favor, busque una dimensión antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idDimension, nuevaDescripcion);
  }
});

/* ===========Botón Listado de Dimensiones ============================ */
listDimensionButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/dimensions`);
  const dimensiones = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  dimensiones.forEach((dimension) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${dimension.id_dimension}</td>
    <td>${dimension.dimension}</td>
  `;
    tableBody.appendChild(row);
  });
  tableDimensions.style.display = "table";
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
    const response = await fetch(`${apiUrl}/api/dimensions/${nombreDimension}`);

    if (response.status === 200) {
      const dimensionEncontrada = await response.json();

      // Muestra la dimensión encontrada

      console.log(dimensionEncontrada);

      // Modifica la pantalla con la dimensión encontrada
      restaurarValoresIniciales();
      dimensionNameField.value = dimensionEncontrada.dimension;
      dimensionIdField.value = dimensionEncontrada.id_dimension;
      mostrarResultados(
        `Dimensión encontrada: ${dimensionEncontrada.dimension}`
      );
      modifyDimensionButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `La dimensión: ${nombreDimension} no fue encontrada`;
    } else {
      errorMessage.textContent = "Ocurrió un error al obtener la dimensión";
      console.error("Error al obtener la dimensión:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al buscar la dimensión.";
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

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  dimensionNameField.value = "";
  dimensionNameField.setAttribute("readonly", "");
  newDimensionButton.textContent = "Agregar";
  findDimensionButton.textContent = "Buscar";
  modifyDimensionButton.textContent = "Modificar";
  findDimensionButton.disabled = false;
  newDimensionButton.disabled = false;
  modifyDimensionButton.disabled = true; // deshabilita el botón de modificar
  newDimensionButton.classList.remove("success-button");
  findDimensionButton.classList.remove("success-button");
  modifyDimensionButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableDimensions.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
