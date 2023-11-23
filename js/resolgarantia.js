const newResolGarantButton = document.getElementById("newResolGarant-btn");
const cancelButton = document.getElementById("cancelResolGarant-btn");
const findResolGarantButton = document.getElementById("findResolGarant-btn");
const modifyResolGarantButton = document.getElementById(
  "modifyResolGarant-btn"
);
const listResolGarantButton = document.getElementById("listResolGarant-btn");
const resolGarantCodeField = document.getElementById("resol-garantia-codigo");
const resolGarantDescriptionField = document.getElementById(
  "resol-garantia-Description"
);
const resolGarantIdField = document.getElementById("resol-garantia-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableResolGarant = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega resolución de garantías=============================== */

newResolGarantButton.addEventListener("click", () => {
  if (newResolGarantButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyResolGarantButton.disabled = true;
    findResolGarantButton.disabled = true;
    resolGarantCodeField.removeAttribute("readonly");
    resolGarantCodeField.value = "";
    resolGarantDescriptionField.removeAttribute("readonly");
    resolGarantDescriptionField.value = ""; // Limpiar el valor del campo
    newResolGarantButton.textContent = "Aceptar";
    newResolGarantButton.classList.add("success-button");
    limpiarResultados();
    resolGarantCodeField.focus();
  } else {
    // Obtener código y nombre de la nueva resolución de garantía
    const nuevaResolGarant = {
      codigo: resolGarantCodeField.value,
      resol_garan: resolGarantDescriptionField.value,
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

/* =================Botón Encontrar========================== */
findResolGarantButton.addEventListener("click", () => {
  if (findResolGarantButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una dimension
    resolGarantCodeField.removeAttribute("readonly");
    resolGarantCodeField.value = "";
    limpiarResultados(); // Ocultar resultados anteriores

    findResolGarantButton.textContent = "Aceptar";
    newResolGarantButton.disabled = true;
    modifyResolGarantButton.disabled = true;
    findResolGarantButton.classList.add("success-button");
    resolGarantCodeField.focus();
  } else {
    // Obtener nombre y código de la resolución
    const codigoResolGarant = resolGarantCodeField.value;

    /* Verifica que sea un código valido */
    if (!esCadenaNoVacia(codigoResolGarant)) {
      errorMessage.textContent =
        "El código de la resolución deben contener información.";
      return;
    }

    buscarResolgarantEnBaseDeDatos(codigoResolGarant);
  }
});

/* ============Botón Modificar==================================== */
modifyResolGarantButton.addEventListener("click", () => {
  if (modifyResolGarantButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newResolGarantButton.disabled = true;
    findResolGarantButton.disabled = true;
    modifyResolGarantButton.textContent = "Aceptar";
    modifyResolGarantButton.classList.add("success-button");
    resolGarantCodeField.removeAttribute("readonly");
    resolGarantDescriptionField.removeAttribute("readonly");
    resolGarantCodeField.focus();
  } else {
    // Obtener el ID de la resolución de garantía y la nueva descripción
    const idResolGarant = parseInt(resolGarantIdField.value);
    const resolGarantModificada = {
      codigo: resolGarantCodeField.value,
      resol_garan: resolGarantDescriptionField.value,
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

/* ===========Botón Listado de Resoluciones de garantía ============================ */
listResolGarantButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/resolutionsWarranty`);
  const resolgarant = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  resolgarant.forEach((resolgarant) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${resolgarant.id_resol_g}</td>
    <td>${resolgarant.codigo}</td>
    <td>${resolgarant.resol_garan}</td>
  `;
    tableBody.appendChild(row);
  });
  tableResolGarant.style.display = "table";
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar resolución de garantía ------------------------
async function agregarResolgarant(nuevaResolgarant) {
  // Realizar una solicitud POST para crear la resolución de garantía

  try {
    const response = await fetch(`${apiUrl}/api/resolutionsWarranty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaResolgarant),
    });
    //console.log(response.status);

    if (response.status === 200) {
      // Éxito: resolución de garantía creada

      restaurarValoresIniciales();
      mostrarResultados("Resolución de garantía creada con éxito.");
    } else if (response.status === 400) {
      // La resolución de garantía o el código ya existe

      const error = await response.json();
      //muestra el mensaje enviado por la api, ya sea que el código o la descripción esté siendo usada
      errorMessage.textContent = error.message;
    } else {
      // Otro error
      console.log(response.status);
      errorMessage.textContent =
        "Ocurrió un error al crear la resolución de garantía.";
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

/*---------- Función para buscar la resolución de garantía en la base de datos ------------*/
async function buscarResolgarantEnBaseDeDatos(codigoResolgarant) {
  try {
    // Realiza una solicitud al servidor para buscar la resolución de garantía por código
    const response = await fetch(
      `${apiUrl}/api/resolutionsWarranty/${codigoResolgarant}`
    );

    if (response.status === 200) {
      const resolgarantEncontrada = await response.json();

      // Muestra la resolución de garantía encontrada

      //console.log(resolgarantEncontrada);

      // Modifica la pantalla con la resolución de garantía encontrada
      restaurarValoresIniciales();
      resolGarantCodeField.value = resolgarantEncontrada.codigo;
      resolGarantDescriptionField.value = resolgarantEncontrada.resol_garan;
      resolGarantIdField.value = resolgarantEncontrada.id_resol_g;
      mostrarResultados(
        `Resolución encontrada: ${resolgarantEncontrada.resol_garan}`
      );
      modifyResolGarantButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `La resolución de garantía código: ${codigoResolgarant} no fue encontrada`;
    } else {
      errorMessage.textContent =
        "Ocurrió un error al obtener la resolución de garantía";
      console.error("Error al obtener la resolución de garantía:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al buscar la resolución de garantía.";
  }
}

/* -----------------Función Actualizar la descripción de la resolución de garantía------------ */

async function actualizarDescripcionEnBaseDeDatos(
  idResolgarant,
  resolGarantModificada
) {
  try {
    // Realiza una solicitud PATCH para modificar la resolución de garantía
    const response = await fetch(
      `${apiUrl}/api/resolutionsWarranty/${idResolgarant}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
    } else if (response.status === 404) {
      // Error: resolución de garantía no encontrada
      errorMessage.textContent = "Resolución no encontrada. Verifique el ID.";
    } else if (response.status === 400) {
      // La resolución de garantía o el código ya existe

      const error = await response.json();
      //muestra el mensaje enviado por la api, ya sea que el código o la descripción esté siendo usada
      errorMessage.textContent = error.message;
    } else {
      // Otro error
      console.error("Error al actualizar la resolución de garantía:", error);
      errorMessage.textContent =
        "Ocurrió un error al modificar la resolución de garantía.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el empleado.");
  }
}

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  resolGarantCodeField.value = "";
  resolGarantDescriptionField.value = "";
  resolGarantCodeField.setAttribute("readonly", "");
  resolGarantDescriptionField.setAttribute("readonly", "");
  newResolGarantButton.textContent = "Agregar";
  findResolGarantButton.textContent = "Buscar";
  modifyResolGarantButton.textContent = "Modificar";
  findResolGarantButton.disabled = false;
  newResolGarantButton.disabled = false;
  modifyResolGarantButton.disabled = true; // deshabilita el botón de modificar
  newResolGarantButton.classList.remove("success-button");
  findResolGarantButton.classList.remove("success-button");
  modifyResolGarantButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableResolGarant.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
