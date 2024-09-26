const newButton = document.getElementById("new-btn");
const cancelButton = document.getElementById("cancel-btn");
const findButton = document.getElementById("find-btn");
const modifyButton = document.getElementById("modify-btn");

const fields = document.querySelectorAll(".form-group input[readonly]");

const idField = document.getElementById("id");
const documentField = document.getElementById("document");
const namesField = document.getElementById("names");
const lastnamesField = document.getElementById("lastnames");
const dvField = document.getElementById("dv");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const addressField = document.getElementById("address");
const stateField = document.getElementById("state");

const errorMessage = document.getElementById("error-message");
const successResults = document.getElementById("success-results");
const form = document.querySelector("form");
const table = document.querySelector("table");
const tableBody = document.querySelector("table tbody");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato de correo electrónico

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

/*==================Botón agregar=========================================*/
newButton.addEventListener("click", () => {
  if (newButton.textContent.trim() === "Agregar") {
    fields.forEach((field) => {
      field.removeAttribute("readonly");
      field.value = "";
    });

    newButton.textContent = "Aceptar";
    newButton.classList.add("success-button");
    modifyButton.disabled = true;
    findButton.disabled = true;

    stateField.style.color = "transparent";

    namesField.focus();
  } else {
    // Validar los campos antes de agregar el cliente
    if (!validateFields()) {
      return; // Si la validación falla, no continuar con la operación
    }
    // Realizar la operación de agregar un nuevo cliente

    // Obtener los datos del nuevo cliente

    const newElement = {
      cedula_nit: documentField.value,
      dv: parseInt(dvField.value),
      nombre: namesField.value,
      apellido: lastnamesField.value,
      telefono: phoneField.value,
      direccion: addressField.value,
      email: emailField.value,
    };
    // Llama a la función para agregar el nuevo Cliente
    createElement(newElement);
  }
});

/* ===========Botón Buscar clientes================================== */
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar clientes
    restaurarValoresIniciales();
    namesField.removeAttribute("readonly");
    lastnamesField.removeAttribute("readonly");
    documentField.removeAttribute("readonly");

    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    namesField.focus();
  } else {
    //crea la variable con los parámetros de búsqueda
    const filtroCliente = {
      cedula_nit: documentField.value,
      nombre: namesField.value,
      apellido: lastnamesField.value,
    };

    //Llamar a la función para buscar clientes

    findCustomers(filtroCliente);
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
    fields.forEach((field) => {
      field.removeAttribute("readonly");
    });
    stateField.disabled = false;
    stateField.style.color = "black";
    namesField.focus();
  } else {
    // Validar los campos antes de agregar el cliente
    if (!validateFields()) {
      return; // Si la validación falla, no continuar con la operación
    }

    // Obtener la información de los campos
    const modifiedElement = {
      cedula_nit: documentField.value,
      dv: parseInt(dvField.value),
      nombre: namesField.value,
      apellido: lastnamesField.value,
      telefono: phoneField.value,
      direccion: addressField.value,
      email: emailField.value,
      estado: stateField.value,
    };

    const id = parseInt(idField.value);
    if (!id) {
      errorMessage.textContent =
        "Debe buscar y seleccionar un cliente para modificarlo";
      return false; // La validación falla
    }
    modifyFunction(id, modifiedElement);
  }
});

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});
//--------------Función para buscar clientes----------------------------------
async function findCustomers(filtroCliente) {
  // Realizar una solicitud al servidor para obtener la lista de clientes.
  try {
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/customers/customerslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filtroCliente),
    });

    if (response.status === 200) {
      // carga la información en la tabla del formulario
      const listaclientes = await response.json();

      //Limpia el contenido de la tabla
      cleanTable(tableBody);
      //Carga el contenido de la consulta en la tabla
      listaclientes.forEach((listacliente) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${listacliente.id_cliente}</td>
            <td>${listacliente.nombre}</td>
            <td>${listacliente.apellido}</td>
            <td>${listacliente.cedula_nit}</td>
            <td>${listacliente.dv}</td>
            <td>${listacliente.email}</td>
            <td>${listacliente.telefono}</td>
            <td>${listacliente.direccion}</td>
            <td>${listacliente.estado}</td>
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

/* ------------Función para validar campos del cliente -------------------- */
function validateFields() {
  if (
    !esCadenaNoVacia(documentField.value) ||
    !esCadenaNoVacia(namesField.value) ||
    !esCadenaNoVacia(phoneField.value) ||
    !esCadenaNoVacia(addressField.value) ||
    !esCadenaNoVacia(emailField.value)
  ) {
    errorMessage.textContent =
      "Por favor, complete todos los campos correctamente.";
    return false; // La validación falla
  }

  if (!emailRegex.test(emailField.value)) {
    errorMessage.textContent = "El campo email no tiene un formato válido";
    emailField.focus();
    return false;
  }

  if (phoneField.value.length !== 10) {
    errorMessage.textContent = "El número telefónico debe ser de 10 digitos";
    phoneField.focus();
    return false;
  }

  errorMessage.textContent = ""; // Limpiar mensaje de error
  return true; // La validación es exitosa
}

//----------------------Función agregar cliente ------------------------
async function createElement(newElement) {
  // Realizar una solicitud POST para crear el cliente
  //console.log(newElement);
  try {
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newElement),
    });

    if (response.status === 200) {
      // Éxito: cliente creado
      restaurarValoresIniciales();
      mostrarResultados("Cliente creado con éxito.");
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear el cliente";
  }
}

/* -------------Función modificar cliente--------------------------------- */
async function modifyFunction(id, modifiedElement) {
  try {
    // Realiza una solicitud PATCH para modificar la información
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/customers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(modifiedElement),
    });

    if (response.status === 200) {
      // Éxito con la modificación
      // Restaura el formulario y los botones
      restaurarValoresIniciales();
      mostrarResultados(
        `Cliente : ${modifiedElement.nombre} Modificado con Éxito`
      );
    } else {
      handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent(
      "Ocurrió un error de red al modificar el Cliente."
    );
  }
}

/* ----------Función para mostrar los resultados positivos de acciones -----------*/
function mostrarResultados(resultados) {
  successResults.style.display = "block"; // Mostrar los resultados
  successResults.innerHTML = resultados;
  errorMessage.textContent = "";
}

/*----------- Función para limpiar los resultados -----------------------*/
function limpiarResultados() {
  successResults.style.display = "none"; // Ocultar resultados
  successResults.innerHTML = ""; // Limpiar resultados anteriores
  errorMessage.textContent = "";
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
    namesField.value = rowData[1];
    lastnamesField.value = rowData[2];
    documentField.value = rowData[3];
    dvField.value = rowData[4];
    emailField.value = rowData[5];
    phoneField.value = rowData[6];
    addressField.value = rowData[7];
    stateField.value = rowData[8];

    // Habilitar el botón de modificar si ya se seleccionó un cliente
    modifyButton.disabled = false;

    //Visible el color de texto de el select de Estado
    stateField.style.color = "white";
  }
});

/* -----------Función Restarurar el Formulario ----------------------- */
function restaurarValoresIniciales() {
  //Establece los campos de entrada de solo lectura y borra contenido
  fields.forEach((field) => {
    field.setAttribute("readonly", "");
    field.value = "";
  });

  stateField.disabled = true;

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

  stateField.style.color = "transparent";

  limpiarResultados();
}
