const newBrandButton = document.getElementById("newBrand-btn");
const cancelButton = document.getElementById("cancelBrand-btn");
const findBrandButton = document.getElementById("findBrand-btn");
const modifyBrandButton = document.getElementById("modifyBrand-btn");
const listBrandButton = document.getElementById("listBrand-btn");
const brandNameField = document.getElementById("brandName");
const brandIdField = document.getElementById("brand-id");
const errorMessage = document.getElementById("error-message");
const succesResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const tableBrands = document.querySelector("table");

import apiUrl from "./config.js";
import { esCadenaNoVacia } from "./funcionesComunes.js";

//Evitar que al darle enter envíe el formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

/* ===========Botón agrega marca=============================== */

newBrandButton.addEventListener("click", () => {
  if (newBrandButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyBrandButton.disabled = true;
    findBrandButton.disabled = true;
    brandNameField.removeAttribute("readonly");
    brandNameField.value = ""; // Limpiar el valor del campo
    newBrandButton.textContent = "Aceptar";
    newBrandButton.classList.add("success-button");
    limpiarResultados();
    brandNameField.focus();
  } else {
    // Obtener nombre de la nueva marca
    const nuevaMarca = {
      marca: brandNameField.value,
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

/* =================Botón Encontrar========================== */
findBrandButton.addEventListener("click", () => {
  if (findBrandButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una marca
    brandNameField.removeAttribute("readonly");
    brandNameField.value = ""; // Limpiar el valor del campo
    limpiarResultados(); // Ocultar resultados anteriores

    findBrandButton.textContent = "Aceptar";
    newBrandButton.disabled = true;
    modifyBrandButton.disabled = true;
    findBrandButton.classList.add("success-button");
    brandNameField.focus();
  } else {
    // Obtener nombre de la marca
    const nombreMarca = brandNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nombreMarca)) {
      errorMessage.textContent =
        "La marca debe contener una cadena de caractéres no vacía.";
      return;
    }

    buscarMarcaEnBaseDeDatos(nombreMarca);
  }
});

/* ============Botón Modificar==================================== */
modifyBrandButton.addEventListener("click", () => {
  if (modifyBrandButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    newBrandButton.disabled = true;
    findBrandButton.disabled = true;
    modifyBrandButton.textContent = "Aceptar";
    modifyBrandButton.classList.add("success-button");
    brandNameField.removeAttribute("readonly");
    brandNameField.focus();
  } else {
    // Obtener el ID de la marca y la nueva descripción
    const idMarca = parseInt(brandIdField.value);
    const nuevaDescripcion = { marca: brandNameField.value };

    // Asegurarse de tener valores válidos antes de continuar
    if (!idMarca || !esCadenaNoVacia(nuevaDescripcion.marca)) {
      errorMessage.textContent =
        "Por favor, busque una marca antes de modificar o ingrese una descripción válida.";
      return;
    }

    actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion);
  }
});

/* ===========Botón Listado de Marcas ============================ */
listBrandButton.addEventListener("click", async () => {
  // Realiza la solicitud al backend
  const response = await fetch(`${apiUrl}/api/brands`);
  const marcas = await response.json();
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
  //Carga el contenido de la consulta en la tabla
  marcas.forEach((marca) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${marca.id_marca}</td>
    <td>${marca.marca}</td>
  `;
    tableBody.appendChild(row);
  });
  tableBrands.style.display = "table";
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//----------------------Función agregar marca ------------------------
async function agregarMarca(nuevaMarca) {
  // Realizar una solicitud POST para crear la marca

  try {
    const response = await fetch(`${apiUrl}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaMarca),
    });

    if (response.status === 200) {
      // Éxito: marca creada

      restaurarValoresIniciales();
      mostrarResultados("Marca creada con éxito.");
    } else if (response.status === 400) {
      // La marca ya existe
      errorMessage.textContent =
        "La nueva descripción ya está siendo utilizada. Por favor, elija otra.";
    } else {
      // Otro error
      errorMessage.textContent = "Ocurrió un error al crear la marca.";
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
    const response = await fetch(`${apiUrl}/api/brands/${nombreMarca}`);

    if (response.status === 200) {
      const marcaEncontrada = await response.json();

      // Muestra la marca encontrada

      console.log(marcaEncontrada);

      // Modifica la pantalla con la marca encontrada
      restaurarValoresIniciales();
      brandNameField.value = marcaEncontrada.marca;
      brandIdField.value = marcaEncontrada.id_marca;
      mostrarResultados(`Marca encontrada: ${marcaEncontrada.marca}`);
      modifyBrandButton.disabled = false;
    } else if (response.status === 404) {
      errorMessage.textContent = `La marca: ${nombreMarca} no fue encontrada`;
    } else {
      errorMessage.textContent = "Ocurrió un error al obtener la marca";
      console.error("Error al obtener la marca:", error);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al buscar la marca.";
  }
}

/* -----------------Función Actualizar la descripción de la marca------------ */

async function actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion) {
  try {
    // Realiza una solicitud PATCH para modificar la marca
    const response = await fetch(`${apiUrl}/api/brands/${idMarca}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
    } else if (response.status === 400) {
      // Error de validación u otro error
      errorMessage.textContent =
        "Esta descripción de marca ya está siendo usada.";
    } else {
      // Otro error
      console.error("Error al actualizar la marca:", error);
      errorMessage.textContent = "Ocurrió un error al modificar la marca.";
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el empleado.");
  }
}

/* -------------función restaura formulario ------------------------------------- */
function restaurarValoresIniciales() {
  brandNameField.value = "";
  brandNameField.setAttribute("readonly", "");
  newBrandButton.textContent = "Agregar";
  findBrandButton.textContent = "Buscar";
  modifyBrandButton.textContent = "Modificar";
  findBrandButton.disabled = false;
  newBrandButton.disabled = false;
  modifyBrandButton.disabled = true; // deshabilita el botón de modificar
  newBrandButton.classList.remove("success-button");
  findBrandButton.classList.remove("success-button");
  modifyBrandButton.classList.remove("success-button");
  errorMessage.textContent = "";
  tableBrands.style.display = "none";
  //Limpia el contenido de la tabla
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }

  limpiarResultados();
}
/*-------------función verificar si una variable contiene una cadena-------------- */
/* function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
} */
