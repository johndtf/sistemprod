const newButton = document.getElementById("newDesign-btn");
const cancelButton = document.getElementById("cancelDesign-btn");
const findButton = document.getElementById("findDesign-btn");
const modifyButton = document.getElementById("modifyDesign-btn");

const nameField = document.getElementById("designName");
const idField = document.getElementById("design-id");

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

/* ===========Botón agrega diseño=============================== */

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
    // Obtener nombre del nuevo diseño
    const nuevoDesign = {
      banda: nameField.value,
    };

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nuevoDesign.banda)) {
      errorMessage.textContent =
        "El diseño debe contener una cadena de caractéres no vacía.";
      return;
    }

    //Llama a la función para agregar el nuevo diseño
    agregarDesign(nuevoDesign);
  }
});

/* =================Botón Encontrar========================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar un diseño
    nameField.removeAttribute("readonly");
    nameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    nameField.focus();
  } else {
    // Obtener nombre del diseño
    const nombreDesign = {
      banda: nameField.value,
    };

    buscarDesignEnBaseDeDatos(nombreDesign);
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
    // Obtener el ID de la diseño y la nueva descripción
    const idDesign = parseInt(idField.value);
    const nuevaDescripcion = { banda: nameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idDesign || !esCadenaNoVacia(nuevaDescripcion.banda)) {
      errorMessage.textContent =
        "Por favor, busque un diseño antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idDesign, nuevaDescripcion);
  }
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar diseño ------------------------
async function agregarDesign(nuevoDesign) {
  // Realizar una solicitud POST para crear el diseño

  try {
    const response = await fetch(`${apiUrl}/api/treads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoDesign),
    });

    if (response.status === 200) {
      // Éxito: diseño creado

      restaurarValoresIniciales();
      mostrarResultados("Diseño creado con éxito.");
    } else if (response.status === 400) {
      // El diseño ya existe
      errorMessage.textContent =
        "El nuevo diseño ya está siendo utilizada. Por favor, elija otro.";
    } else {
      // Otro error
      errorMessage.textContent = "Ocurrió un error al crear el diseño.";
    }
  } catch (error) {
    //console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear el diseño.";
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

/*---------- Función para buscar el diseño en la base de datos ------------*/
async function buscarDesignEnBaseDeDatos(nombreDesign) {
  try {
    // Realiza una solicitud al servidor para buscar el diseño

    const response = await fetch(`${apiUrl}/api/treads/treadslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nombreDesign),
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
    <td>${dataelement.id_banda}</td>
    <td>${dataelement.banda}</td>
    
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

/* -----------------Función Actualizar la descripción de el diseño------------ */

async function actualizarDescripcionEnBaseDeDatos(idDesign, nuevaDescripcion) {
  try {
    // Realiza una solicitud PATCH para modificar el diseño
    const response = await fetch(`${apiUrl}/api/treads/${idDesign}`, {
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

      mostrarResultados(`Diseño modificado: ${nuevaDescripcion.banda}`);
    } else if (response.status === 404) {
      // Error: Banda no encontrada
      errorMessage.textContent = "Diseño no encontrado. Verifique el ID.";
    } else if (response.status === 400) {
      // Error de validación u otro error
      errorMessage.textContent =
        "Esta descripción de diseño ya está siendo usada.";
    } else {
      // Otro error
      console.error("Error al actualizar el diseño:", error);
      errorMessage.textContent = "Ocurrió un error al modificar el diseño.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el diseño.");
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
