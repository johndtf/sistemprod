const newButton = document.getElementById("newBrand-btn");
const cancelButton = document.getElementById("cancelBrand-btn");
const findButton = document.getElementById("findBrand-btn");
const modifyButton = document.getElementById("modifyBrand-btn");

const nameField = document.getElementById("brandName");
const idField = document.getElementById("brand-id");

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

/* ===========Botón agrega marca=============================== */

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
    // Obtener nombre de la nueva marca
    const nuevaMarca = {
      marca: nameField.value,
    };

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nuevaMarca.marca)) {
      errorMessage.textContent =
        "La marca debe contener una cadena de caractéres no vacía.";
      return;
    }

    //Llama a la función para agregar la nueva marca
    agregarMarca(nuevaMarca);
  }
});

/* =================Botón Buscar========================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una marca
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    nameField.focus();
  } else {
    // Obtener nombre de la marca
    const nombreMarca = {
      marca: nameField.value,
    };

    buscarMarcaEnBaseDeDatos(nombreMarca);
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
    // Obtener el ID de la marca y la nueva descripción
    const idMarca = parseInt(idField.value);
    const nuevaDescripcion = { marca: nameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idMarca || !esCadenaNoVacia(nuevaDescripcion.marca)) {
      errorMessage.textContent =
        "Por favor, busque una marca antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion);
  }
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar marca ------------------------
async function agregarMarca(nuevaMarca) {
  // Realizar una solicitud POST para crear la marca

  try {
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaMarca),
    });

    if (response.status === 200) {
      // Éxito: marca creada

      restaurarValoresIniciales();
      mostrarResultados("Marca creada con éxito.");
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    //console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear la marca.";
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

/*---------- Función para buscar la marca en la base de datos ------------*/
async function buscarMarcaEnBaseDeDatos(nombreMarca) {
  try {
    // Realiza una solicitud al servidor para buscar la marca
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/brands/brandslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nombreMarca),
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
    <td>${dataelement.id_marca}</td>
    <td>${dataelement.marca}</td>
    
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
      "Ocurrió un error de red al hacer la consulta, por favor verifica tu conexión a Internet.";
  }
}

/* -----------------Función Actualizar la descripción de la marca------------ */

async function actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion) {
  try {
    // Realiza una solicitud PATCH para modificar la marca
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/brands/${idMarca}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaDescripcion),
    });

    if (response.status === 200) {
      // Éxito: marca modificada
      // Restaura el formulario y los botones
      restaurarValoresIniciales();

      mostrarResultados(`Marca modificada: ${nuevaDescripcion.marca}`);
    } else if (response.status === 404) {
      // Error: marca no encontrada
      errorMessage.textContent = "Marca no encontrada. Verifique el ID.";
    } else {
      handleErrorResponse(response, errorMessage);
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
/*-------------función verificar si una variable contiene una cadena-------------- */
/* function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
} */
