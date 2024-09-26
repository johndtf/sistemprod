// Selecciona los elementos del formulario y los botones

const newButton = document.getElementById("new-btn");
const cancelButton = document.getElementById("cancel-btn");
const findButton = document.getElementById("find-btn");
const modifyButton = document.getElementById("modify-btn");

const fields = document.querySelectorAll(".form-group input[readonly]");

const idField = document.getElementById("employee-id");
const namesField = document.getElementById("usernames");
const lastnamesField = document.getElementById("userlastnames");
const cedulaField = document.getElementById("cedula");
const emailField = document.getElementById("email");
const telefonoField = document.getElementById("telefono");
const direccionField = document.getElementById("direccion");
const perfilField = document.getElementById("perfilSelect");
const stateField = document.getElementById("state");
// ######implementar permisos ultima modificación elemento siguiente
const errorMessage = document.getElementById("error-message");
const successResults = document.getElementById("success-results");
const form = document.querySelector("form");
const tableBody = document.querySelector("table tbody");
const table = document.querySelector("table");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato de correo electrónico

import apiUrl from "./config.js";
//#######implementar permisos ultima modificación elemento siguiente
import {
  esCadenaNoVacia,
  cleanTable,
  handleErrorResponse,
} from "./funcionesComunes.js";

//==============AGREGAR EMPLEADO====================================

// Agrega un evento al botón "Agregar"
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

    perfilField.disabled = false;
    perfilField.style.color = "black";
    stateField.style.color = "transparent";

    namesField.focus();
  } else {
    // Validar los campos antes de agregar registro
    if (!validateFields()) {
      return; // Si la validación falla, no continuar con la operación
    }
    // Realizar la operación de agregar un nuevo empleado
    const newElement = {
      cedula: parseInt(cedulaField.value),
      nombre: namesField.value,
      apellido: lastnamesField.value,
      telefono: telefonoField.value,
      direccion: direccionField.value,
      email: emailField.value,
      id_perfil: parseInt(perfilField.value),
    };
    // Llama a la función para agregar el nuevo empleado
    // console.log(newElement.id_perfil);
    createElement(newElement);
  }
});

// ================BOTÓN MODIFICAR EMPLEADO===================

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
    perfilField.disabled = false;
    perfilField.style.color = "black";
    namesField.focus();
  } else {
    // Validar los campos antes de agregar el cliente
    if (!validateFields()) {
      return; // Si la validación falla, no continuar con la operación
    }

    // Obtener la información de los campos
    const modifiedElement = {
      cedula: parseInt(cedulaField.value),
      nombre: namesField.value,
      apellido: lastnamesField.value,
      telefono: telefonoField.value,
      direccion: direccionField.value,
      email: emailField.value,
      id_perfil: parseInt(perfilField.value),
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

// ==================BOTON BUSCAR =============================
findButton.addEventListener("click", () => {
  if (findButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar clientes
    restaurarValoresIniciales();
    namesField.removeAttribute("readonly");
    lastnamesField.removeAttribute("readonly");
    cedulaField.removeAttribute("readonly");

    limpiarResultados(); // Ocultar resultados anteriores

    findButton.textContent = "Aceptar";
    newButton.disabled = true;
    modifyButton.disabled = true;
    findButton.classList.add("success-button");
    namesField.focus();
  } else {
    //crea la variable con los parámetros de búsqueda
    const filtroEmpleado = {
      cedula: cedulaField.value,
      nombre: namesField.value,
      apellido: lastnamesField.value,
    };

    //Llamar a la función para buscar clientes

    findEmployees(filtroEmpleado);
  }
});

/* ===================Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  restaurarValoresIniciales();
});

/* --------------------------Carga de perfiles-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Realizar una solicitud al servidor para obtener la lista de perfiles
  const token = localStorage.getItem("myTokenName");
  fetch(`${apiUrl}/api/profiles/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Llenar dinámicamente el select con opciones de perfil

      data.forEach((perfil) => {
        const option = document.createElement("option");
        option.value = perfil.id_perfil; // Asigna el valor del perfil
        option.text = perfil.perfil; // Asigna el nombre del perfil
        perfilField.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar perfiles", error));
});
/* ------------Función para validar campos -------------------- */
function validateFields() {
  if (
    !esCadenaNoVacia(namesField.value) ||
    !esCadenaNoVacia(lastnamesField.value) ||
    !esCadenaNoVacia(cedulaField.value) ||
    !esCadenaNoVacia(emailField.value) ||
    !esCadenaNoVacia(telefonoField.value) ||
    !esCadenaNoVacia(direccionField.value)
  ) {
    errorMessage.textContent =
      "Por favor, complete todos los campos correctamente.";
    return false; // La validación falla
  }

  if (namesField.value.length < 2) {
    errorMessage.textContent = "El nombre debe ser de al menos 2 caracteres";
    namesField.focus();
    return false;
  }

  if (lastnamesField.value.length < 2) {
    errorMessage.textContent = "El apellido debe ser de al menos 2 caracteres";
    lastnamesField.focus();
    return false;
  }

  if (!emailRegex.test(emailField.value)) {
    errorMessage.textContent = "El campo email no tiene un formato válido";
    emailField.focus();
    return false;
  }

  if (telefonoField.value.length !== 10) {
    errorMessage.textContent = "El número telefónico debe ser de 10 dígitos";
    telefonoField.focus();
    return false;
  }

  if (cedulaField.value.length < 8) {
    errorMessage.textContent = "La cédula debe tener entre 8 y 10 dígitos";
    cedulaField.focus();
    return false;
  }

  if (direccionField.value.length < 10) {
    errorMessage.textContent =
      "La dirección no puede tener menos de 10 caracteres";
    direccionField.focus();
    return false;
  }

  errorMessage.textContent = ""; // Limpiar mensaje de error
  return true; // La validación es exitosa
}

//=============Función agregar empleado ==========================

async function createElement(newElement) {
  // Realizar una solicitud POST para crear el registro

  try {
    const token = localStorage.getItem("myTokenName");

    const response = await fetch(`${apiUrl}/api/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        authorization: `Bearer ${token}`, //incluir token en el encabezado
      },
      body: JSON.stringify(newElement),
    });

    if (response.status === 200) {
      // Éxito: registro creado

      restaurarValoresIniciales();

      mostrarResultados("Empleado creado con éxito.");
    }
    else {// Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage)
    };
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent = "Ocurrió un error de red al crear el registro";
  }
}
//-------Función Buscar Empleado--------------------------

async function findEmployees(filtroEmpleado) {
  try {
    const token = localStorage.getItem("myTokenName");

    const response = await fetch(`${apiUrl}/api/employees/employeeslist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
      body: JSON.stringify(filtroEmpleado),
    });

    // Validar el código de estado de la respuesta
    if (response.ok) {
      // Si el código de estado es 200, procesar la respuesta
      const listaempleados = await response.json();

      // Limpiar la tabla y agregar nuevas filas
      cleanTable(tableBody);
      listaempleados.forEach((listaempleado) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${listaempleado.id_empleado}</td>
          <td>${listaempleado.nombre}</td>
          <td>${listaempleado.apellido}</td>
          <td>${listaempleado.cedula}</td>
          <td>${listaempleado.email}</td>
          <td>${listaempleado.telefono}</td>
          <td>${listaempleado.direccion}</td>
          <td>${listaempleado.id_perfil}</td>
          <td>${listaempleado.perfil}</td>
          <td>${listaempleado.estado}</td>
        `;
        tableBody.appendChild(row);
      });
      table.style.display = "table";
    } else {
      // Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    errorMessage.textContent =
      "Ocurrió un error de red al hacer la consulta. Por favor, verifica tu conexión a Internet.";
  }
}

/* ---------------FUNCION MODIFICAR EMPLEADO---------------- */

async function modifyFunction(id, modifiedElement) {
  try {
    // Realiza una solicitud PATCH para modificar la información

    const token = localStorage.getItem("myTokenName");

    const response = await fetch(`${apiUrl}/api/employees/${id}`, {
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
        `Empleado : ${modifiedElement.nombre} Modificado con Éxito`
      );
    } else {
      // Manejo de errores por código de estado
      await handleErrorResponse(response, errorMessage);
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el registro.");
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
    cedulaField.value = rowData[3];
    emailField.value = rowData[4];
    telefonoField.value = rowData[5];
    direccionField.value = rowData[6];
    perfilField.value = rowData[7];
    stateField.value = rowData[9];

    // Habilitar el botón de modificar si ya se seleccionó un cliente
    modifyButton.disabled = false;

    //Visible el color de texto de el select de Estado
    stateField.style.color = "white";
    perfilField.style.color = "white";
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
  perfilField.disabled = true;

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
  perfilField.style.color = "transparent";

  limpiarResultados();
}
