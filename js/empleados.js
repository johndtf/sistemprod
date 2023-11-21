// Selecciona los elementos del formulario y los botones
const employeeIdField = document.getElementById("employee-id");
const usernamesField = document.getElementById("usernames");
const userlastnamesField = document.getElementById("userlastnames");
const cedulaField = document.getElementById("cedula");
const emailField = document.getElementById("email");
const telefonoField = document.getElementById("telefono");
const direccionField = document.getElementById("direccion");
const perfilField = document.getElementById("perfil");
const loginField = document.getElementById("login");
const passwordField = document.getElementById("password");
const stateField = document.getElementById("state");
const nuevoEmployeeButton = document.getElementById("nuevoEmployee-btn");
const modifyEmployeeButton = document.getElementById("modifyEmployee-btn");
const findEmployeeButton = document.getElementById("findEmployee-btn");
const cancelEmployeeButton = document.getElementById("cancelEmployee-btn");
// Elemento donde se muestra la lista de empleados.
const employeeList = document.getElementById("employee-list");

//=============LISTADO DE EMPLEADOS=========================
// Selecciona el enlace
const enlaceListadoEmpleados = document.querySelector(
  'a[href="http://localhost:8080/empleados/"]'
);

// Agrega un evento clic al enlace para manejar la solicitud
enlaceListadoEmpleados.addEventListener("click", async (event) => {
  event.preventDefault(); // Evita que el enlace recargue la página

  // Realiza la solicitud al backend
  const response = await fetch("/empleados/");
  const data = await response.json();

  // Ahora 'data' contiene los datos en formato JavaScript

  // Construye una tabla HTML para mostrar los empleados.
  const table = document.createElement("table");
  table.innerHTML = `
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombres</th>
      <th>Apellidos</th>
      <th>Cédula/NIT</th>
      <th>Correo Electrónico</th>
      <th>Teléfono</th>
      <th>Dirección</th>
      <th>Perfil</th>
      <th>Estado</th>
      
    </tr>
  </thead>
  <tbody>
    ${data
      .map(
        (employee) => `
      <tr>
        <td>${employee.idEmpleado}</td>
        <td>${employee.nombre}</td>
        <td>${employee.apellido}</td>
        <td>${employee.cedula}</td>
        <td>${employee.email}</td>        
        <td>${employee.telefono}</td>
        <td>${employee.direccion}</td>
        <td>${employee.idPerfil}</td>
        <td>${employee.estado}</td>
      </tr>`
      )
      .join("")}
  </tbody>
`;
  //Si ya tiene una tabla de empleados la borra primero
  if (employeeList.firstChild) {
    employeeList.removeChild(employeeList.firstChild);
  }

  // Agrega la tabla al elemento principal.
  employeeList.appendChild(table);
});

//==============AGREGAR EMPLEADO====================================
// Variable para mantener el estado de la operación actual (nuevo o modificar)
let operationMode = "nuevo"; // Puede ser "nuevo" o "modificar"

// Agrega un evento al botón "Agregar"
nuevoEmployeeButton.addEventListener("click", () => {
  if (nuevoEmployeeButton.textContent.trim() === "Agregar") {
    // Preparar para agregar un nuevo empleado
    clearEmployeeFields();
    enableEmployeeFields();
    operationMode = "nuevo";
    nuevoEmployeeButton.textContent = "Aceptar";
    nuevoEmployeeButton.classList.add("success-button");
    findEmployeeButton.disabled = true;
  } else {
    // Realizar la operación de agregar un nuevo empleado
    const nuevoEmpleado = {
      cedula: parseInt(cedulaField.value),
      nombre: usernamesField.value,
      apellido: userlastnamesField.value,
      telefono: telefonoField.value,
      direccion: direccionField.value,
      email: emailField.value,
      idPerfil: parseInt(perfilField.value),
      usuario: loginField.value,
      contrasenia: passwordField.value,
      estado: stateField.value,
    };
    // Llama a la función para agregar el nuevo empleado
    agregarEmpleado(nuevoEmpleado);
  }
});

// ================MODIFICAR EMPLEADO===================
modifyEmployeeButton.addEventListener("click", () => {
  if (modifyEmployeeButton.textContent.trim() === "Modificar") {
    // Preparar para modificar un empleado
    enableEmployeeFields();

    modifyEmployeeButton.textContent = "Aceptar";
    modifyEmployeeButton.classList.add("success-button");
    nuevoEmployeeButton.disabled = true;
    findEmployeeButton.disabled = true;
    usernamesField.focus();
  } else {
    // Realizar la operación de modificar un empleado
    const empleadoActualizado = {
      idEmpleado: parseInt(employeeIdField.value),
      cedula: parseInt(cedulaField.value),
      nombre: usernamesField.value,
      apellido: userlastnamesField.value,
      telefono: telefonoField.value,
      direccion: direccionField.value,
      email: emailField.value,
      idPerfil: parseInt(perfilField.value),
      usuario: loginField.value,
      contrasenia: passwordField.value,
      estado: stateField.value,
    };
    idEmpleado = parseInt(employeeIdField.value);
    // Llama a una función para modificar el empleado

    modificarEmpleado(idEmpleado, empleadoActualizado);
  }
});

// ==================BOTON BUSCAR EMPLEADO=============================
findEmployeeButton.addEventListener("click", () => {
  if (findEmployeeButton.textContent.trim() === "Buscar") {
    // Preparar para buscar un empleado por cédula
    clearEmployeeFields();
    cedulaField.removeAttribute("readonly");

    findEmployeeButton.textContent = "Aceptar";
    findEmployeeButton.classList.add("success-button");
    nuevoEmployeeButton.disabled = true;
    modifyEmployeeButton.disabled = true;
    cedulaField.focus();
  } else {
    const cedula = cedulaField.value;
    // Llama a una función para buscar el empleado (deberás implementarla)
    buscarEmpleado(cedula);
  }
});

// ===================Botón Cancelar======================
cancelEmployeeButton.addEventListener("click", () => {
  clearEmployeeFields();
  disableEmployeeFields();
  modifyEmployeeButton.textContent = "Modificar";
  modifyEmployeeButton.classList.remove("success-button");
  modifyEmployeeButton.disabled = true;
  operationMode = "nuevo";
  nuevoEmployeeButton.textContent = "Agregar";
  nuevoEmployeeButton.disabled = false;
  nuevoEmployeeButton.classList.remove("success-button");
  findEmployeeButton.disabled = false;
  findEmployeeButton.textContent = "Buscar";
  findEmployeeButton.classList.remove("success-button");
  //Si ya tiene una tabla de empleados la borra
  if (employeeList.firstChild) {
    employeeList.removeChild(employeeList.firstChild);
  }
});

// ------------Función para limpiar los campos del formulario----------------
function clearEmployeeFields() {
  employeeIdField.value = "";
  usernamesField.value = "";
  userlastnamesField.value = "";
  cedulaField.value = "";
  emailField.value = "";
  telefonoField.value = "";
  direccionField.value = "";
  perfilField.value = "";
  loginField.value = "";
  passwordField.value = "";
  stateField.value = "";
}

// ---------Función para habilitar los campos del formulario---------------------
function enableEmployeeFields() {
  usernamesField.removeAttribute("readonly");
  userlastnamesField.removeAttribute("readonly");
  cedulaField.removeAttribute("readonly");
  emailField.removeAttribute("readonly");
  telefonoField.removeAttribute("readonly");
  direccionField.removeAttribute("readonly");
  perfilField.removeAttribute("readonly");
  loginField.removeAttribute("readonly");
  passwordField.removeAttribute("readonly");
  stateField.removeAttribute("readonly");
}

// --------Función para deshabilitar los campos del formulario-------------
function disableEmployeeFields() {
  usernamesField.setAttribute("readonly", "");
  userlastnamesField.setAttribute("readonly", "");
  cedulaField.setAttribute("readonly", "");
  emailField.setAttribute("readonly", "");
  telefonoField.setAttribute("readonly", "");
  direccionField.setAttribute("readonly", "");
  perfilField.setAttribute("readonly", "");
  loginField.setAttribute("readonly", "");
  passwordField.setAttribute("readonly", "");
  stateField.setAttribute("readonly", "");
}

//=============Función agregar empleado ==========================
async function agregarEmpleado(nuevoEmpleado) {
  // Realizar una solicitud POST para crear el empleado

  try {
    const response = await fetch("/empleados/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoEmpleado),
    });

    if (response.status === 201) {
      // Éxito: empleado creado
      alert("Empleado creado con éxito.");
      // Limpiar el formulario y realizar otras acciones necesarias
      clearEmployeeFields();
      disableEmployeeFields();
      nuevoEmployeeButton.textContent = "Agregar";
      findEmployeeButton.disabled = false;
      nuevoEmployeeButton.classList.remove("success-button");
    } else if (response.status === 400) {
      // Error de validación u otro error
      alert("Error al crear el empleado. Verifique los datos ingresados.");
    } else {
      // Otro error
      alert("Ocurrió un error al crear el empleado.");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al crear el empleado.");
  }
}

//-------Función Buscar Empleado--------------------------
// Función para buscar un empleado por cédula
async function buscarEmpleado(cedula) {
  try {
    // Realiza una solicitud al servidor para buscar al empleado por cédula
    const response = await fetch(`/empleados/buscar/${cedula}`);

    if (response.ok) {
      const empleadoEncontrado = await response.json();
      if (empleadoEncontrado) {
        // Muestra los datos del empleado encontrado en los campos del formulario

        console.log(empleadoEncontrado);

        employeeIdField.value = empleadoEncontrado.idEmpleado;
        usernamesField.value = empleadoEncontrado.nombre;
        userlastnamesField.value = empleadoEncontrado.apellido;
        cedulaField.value = empleadoEncontrado.cedula;
        emailField.value = empleadoEncontrado.email;
        telefonoField.value = empleadoEncontrado.telefono;
        direccionField.value = empleadoEncontrado.direccion;
        perfilField.value = empleadoEncontrado.idPerfil;
        loginField.value = empleadoEncontrado.usuario;
        passwordField.value = empleadoEncontrado.contrasenia;
        stateField.value = empleadoEncontrado.estado;

        // Modifica la pantalla con el empleado encontrado
        modifyEmployeeButton.disabled = false;
        nuevoEmployeeButton.disabled = false;
        findEmployeeButton.textContent = "Buscar";
        findEmployeeButton.classList.remove("success-button");
        cedulaField.setAttribute("readonly", "");
      } else {
        alert("No se encontró ningún empleado con esa cédula.");
      }
    } else {
      alert("Hubo un error al buscar al empleado.");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al buscar al empleado.");
  }
}

/* ---------------FUNCION MODIFICAR EMPLEADO---------------- */
async function modificarEmpleado(idEmpleado, empleadoActualizado) {
  try {
    // Realiza una solicitud PUT para modificar el empleado
    const response = await fetch(`/empleados/${idEmpleado}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleadoActualizado),
    });

    if (response.status === 200) {
      // Éxito: empleado modificado
      alert("Empleado modificado con éxito.");

      // Restaura el formulario y los botones
      clearEmployeeFields();
      disableEmployeeFields();
      modifyEmployeeButton.textContent = "Modificar";
      modifyEmployeeButton.classList.remove("success-button");
      modifyEmployeeButton.disabled = true;
      nuevoEmployeeButton.disabled = false;
      findEmployeeButton.disabled = false;
    } else if (response.status === 404) {
      // Error: empleado no encontrado
      alert("Empleado no encontrado. Verifique el ID.");
    } else if (response.status === 400) {
      // Error de validación u otro error
      alert("Error al modificar el empleado. Verifique los datos ingresados.");
    } else {
      // Otro error
      alert("Ocurrió un error al modificar el empleado.");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Ocurrió un error de red al modificar el empleado.");
  }
}
