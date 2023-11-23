const newDesignButton = document.getElementById("newDesign-btn");
const cancelButton = document.getElementById("cancelDesign-btn");
const findDesignButton = document.getElementById("findDesign-btn");
const modifyDesignButton = document.getElementById("modifyDesign-btn");
const listDesignButton = document.getElementById("listDesign-btn");
const designNameField = document.getElementById("designName");
const designIdField = document.getElementById("design-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableDesigns = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega diseño=============================== */

newDesignButton.addEventListener("click", () => {
  if (newDesignButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyDesignButton.disabled = true;
    findDesignButton.disabled = true;
    designNameField.removeAttribute("readonly");
    designNameField.value = ""; // Limpiar el valor del campo
    newDesignButton.textContent = "Aceptar";
    newDesignButton.classList.add("success-button");
    limpiarResultados();
    designNameField.focus();
  } else {
    // Obtener nombre del nuevo diseño
    const nuevoDesign = {
      banda: designNameField.value,
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
findDesignButton.addEventListener("click", () => {
  if (findDesignButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar un diseño
    designNameField.removeAttribute("readonly");
    designNameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findDesignButton.textContent = "Aceptar";
    newDesignButton.disabled = true;
    modifyDesignButton.disabled = true;
    findDesignButton.classList.add("success-button");
    designNameField.focus();
  } else {
    // Obtener nombre del diseño
    const nombreDesign = designNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nombreDesign)) {
      errorMessage.textContent =
        "El diseño debe contener una cadena de caractéres no vacía.";
      return;
    }

    buscarDesignEnBaseDeDatos(nombreDesign);
  }
});

/* ============Botón Modificar==================================== */
modifyDesignButton.addEventListener("click", () => {
  if (modifyDesignButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newDesignButton.disabled = true;
    findDesignButton.disabled = true;
    modifyDesignButton.textContent = "Aceptar";
    modifyDesignButton.classList.add("success-button");
    designNameField.removeAttribute("readonly");
    designNameField.focus();
  } else {
    // Obtener el ID de la diseño y la nueva descripción
    const idDesign = parseInt(designIdField.value);
    const nuevaDescripcion = { banda: designNameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idDesign || !esCadenaNoVacia(nuevaDescripcion.banda)) {
      errorMessage.textContent =
        "Por favor, busque un diseño antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idDesign, nuevaDescripcion);
  }
});

/* ===========Botón Listado de Diseños ============================ */
listDesignButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/treads`);
  const designs = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  designs.forEach((disenio) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${disenio.id_banda}</td>
    <td>${disenio.banda}</td>
  `;
    tableBody.appendChild(row);
  });
  tableDesigns.style.display = "table";
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
    const response = await fetch(`${apiUrl}/api/treads/${nombreDesign}`);

    if (response.status === 200) {
      const bandaEncontrada = await response.json();

      // Muestra la banda encontrada

      console.log(bandaEncontrada);

      // Modifica la pantalla con el diseño encontrado
      restaurarValoresIniciales();
      designNameField.value = bandaEncontrada.banda;
      designIdField.value = bandaEncontrada.id_banda;
      mostrarResultados(`Banda encontrada: ${bandaEncontrada.banda}`);
      modifyDesignButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `El diseño: ${nombreDesign} no fue encontrado`;
    } else {
      errorMessage.textContent = "Ocurrió un error al obtener el diseño";
      console.error("Error al obtener el diseño:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al buscar el diseño.";
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

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  designNameField.value = "";
  designNameField.setAttribute("readonly", "");
  newDesignButton.textContent = "Agregar";
  findDesignButton.textContent = "Buscar";
  modifyDesignButton.textContent = "Modificar";
  findDesignButton.disabled = false;
  newDesignButton.disabled = false;
  modifyDesignButton.disabled = true; // deshabilita el botón de modificar
  newDesignButton.classList.remove("success-button");
  findDesignButton.classList.remove("success-button");
  modifyDesignButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableDesigns.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
