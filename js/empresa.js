const searchButton = document.getElementById("search-button");
const updateButton = document.getElementById("Actualizar-btn");

const searchField = document.getElementById("search-input");
const documentField = document.getElementById("document");
const namesField = document.getElementById("names");
const lastnamesField = document.getElementById("lastnames");
const esloganField = document.getElementById("eslogan");
const idfield = document.getElementById("customer-id");

const confirmationModal = document.getElementById("confirmationModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const messageContainer = document.getElementById("message-container");

import apiUrl from "./config.js";

/* -----------------------Carga de información de la empresa--------------------- */

// Realizar una solicitud al servidor para obtener la info de la empresa
fetch(`${apiUrl}/api/customers/company`)
  .then((response) => response.json())
  .then((data) => {
    if (!data) {
      console.error("La respuesta no tiene el formato esperado");
      return;
    }
    // carga la información en los campos
    idfield.value = data.id;
    documentField.value = data.cedula_nit;
    namesField.value = data.nombre;
    lastnamesField.value = data.apellido;
    esloganField.value = data.eslogan;
  })
  .catch((error) => {
    console.error("Error al cargar información de la empresa", error);
    // Mostrar un mensaje de error al usuario

    showMessage("Hubo un problema al cargar la información de la empresa.");
  });

/* ========================Botón Buscar cliente ============================== */

searchButton.addEventListener("click", () => {
  if (searchField.value.length < 8) {
    showMessage("La cédula o Nit debe contener entre 8 y 10 números");
    searchField.focus();
    return;
  }

  const cedula_nit = searchField.value;
  findCustomer(cedula_nit);
});

/* =====================Botón Actualizar=========================== */
updateButton.addEventListener("click", () => {
  if (!idfield.value || idfield.value === "undefined") {
    showMessage(
      "Debe encontrar un cliente antes de realizar una actualización"
    );
    searchField.focus();
    return;
  }
  if (!esloganField.value) {
    showMessage("Debe escribir al menos un caracter en el eslogan");
    return;
  }

  // Muestra el cuadro de diálogo modal al hacer clic en el botón de actualizar
  confirmationModal.style.display = "block";
});

/* ======================Botón Confirmar============================= */

// Agrega un listener al botón de confirmar en el cuadro de diálogo
confirmBtn.addEventListener("click", () => {
  // Realiza la actualización solo si el usuario confirma
  const modifiedCompany = {
    id: idfield.value,
    eslogan: esloganField.value,
  };

  updateCompany(modifiedCompany);

  // Oculta el cuadro de diálogo después de confirmar
  confirmationModal.style.display = "none";
});

/* ========================Botón Cancelar===================== */
// Agrega un listener al botón de cancelar en el cuadro de diálogo
cancelBtn.addEventListener("click", () => {
  // Oculta el cuadro de diálogo si el usuario cancela
  confirmationModal.style.display = "none";
});

/* ----------------Función encontrar cliente----------------------------- */
async function findCustomer(cedula_nit) {
  try {
    const response = await fetch(`${apiUrl}/api/customers/${cedula_nit}`);

    if (response.status === 200) {
      // carga la información en los campos
      const data = await response.json();

      idfield.value = data.id_cliente;
      documentField.value = data.cedula_nit;
      namesField.value = data.nombre;
      lastnamesField.value = data.apellido;
      esloganField.value = "";
    } else if (response.status === 404) {
      // Error: cliente no encontrado
      showMessage("Cliente no encontrado. Verifique la cédula.");
    } else if (response.status === 500) {
      //Error en servidor
      showMessage("Error interno del servidor");
    }
  } catch (error) {
    console.error("Error de red:", error);
    showMessage("Ocurrió un error de red al buscar al Cliente.");
  }
}

/* -------------------------Función actualizar compañía--------------------------- */

async function updateCompany(modifiedCompany) {
  try {
    const response = await fetch(`${apiUrl}/api/customers/updatedata`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedCompany),
    });

    if (response.status === 200) {
      showMessage("Empresa actualizada con éxito");
    } else if (response.status === 400) {
      showMessage("Se requiere el id y el eslogan para la actualización");
    } else if (response.status === 500) {
      showMessage("Error interno del servidor");
    } else {
      showMessage("Ocurrió un error al modificar la empresa");
    }
  } catch (error) {
    console.error("Error de red:", error);
    showMessage("Ocurrió un error de red al modificar el Cliente.");
  }
}

/* -------------------Función para mostrar mensajes----------------------- */
function showMessage(message) {
  messageContainer.textContent = message;
}

function hideMessage() {
  messageContainer.style.backgroundColor = "transparent";
  messageContainer.style.color = "transparent";
}
