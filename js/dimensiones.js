const newDimensionButton = document.getElementById("newDimension-btn");
const cancelButton = document.getElementById("cancelDimension-btn");
const findDimensionButton = document.getElementById("findDimension-btn");
const modifyDimensionButton = document.getElementById("modifyDimension-btn");
const dimensionNameField = document.getElementById("dimensionName");
const dimensionIdField = document.getElementById("dimension-id");
const errorMessage = document.getElementById("error-message");
const searchResults = document.getElementById("search-results");

/* Variables globales */
var dimensionName = "";

/* ===========Botón Agregar Dimensión=============================== */

newDimensionButton.addEventListener("click", () => {
  if (newDimensionButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    modifyDimensionButton.disabled = true;
    dimensionNameField.removeAttribute("readonly");
    dimensionNameField.value = ""; // Limpiar el valor del campo
    newDimensionButton.textContent = "Aceptar";
    dimensionNameField.focus();
  } else {
    // Obtener nombre de la nueva dimensión
    var nuevaDimension = dimensionNameField.value;

    /* Verifica que sea una dimensión válida */
    if (!esCadenaNoVacia(nuevaDimension)) {
      errorMessage.textContent =
        "La dimensión debe contener una cadena de caractéres no vacía.";
      return;
    }

    // Crear un objeto XMLHttpRequest para enviar una solicitud POST al controlador
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/dimensiones/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Define una función para manejar la respuesta del servidor
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201) {
          // La solicitud se completó con éxito
          alert("Dimensión agregada con éxito.");
          dimensionNameField.setAttribute("readonly", "");
          newDimensionButton.textContent = "Agregar";
          dimensionNameField.value = ""; // Limpiar el valor del campo
          errorMessage.textContent = "";
        } else if (xhr.status === 409) {
          // La dimensión ya existe
          errorMessage.textContent =
            "La dimensión ya existe. Por favor, elija otra.";
        } else {
          // Otro error
          errorMessage.textContent =
            "Error al agregar la dimensión. Inténtelo nuevamente.";
        }
      }
    };

    // Crear un objeto Dimension con el nombre de la nueva dimensión
    var nuevaDimensionObj = {
      dimension: nuevaDimension,
    };

    // Enviar los datos del formulario al controlador
    xhr.send(JSON.stringify(nuevaDimensionObj));
  }
});

/* =================Botón Buscar Dimensión========================== */
findDimensionButton.addEventListener("click", () => {
  if (findDimensionButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una dimensión
    dimensionNameField.removeAttribute("readonly");
    dimensionNameField.value = ""; // Limpiar el valor del campo
    findDimensionButton.textContent = "Aceptar";
    dimensionNameField.focus();
    searchResults.style.display = "none"; // Ocultar resultados anteriores
  } else {
    // Obtener nombre de la dimensión
    dimensionName = dimensionNameField.value;

    /* Verifica que sea una dimensión válida */
    if (!esCadenaNoVacia(dimensionName)) {
      errorMessage.textContent =
        "La dimensión debe contener una cadena de caractéres no vacía.";
      return;
    }

    buscarDimensionEnBaseDeDatos(dimensionName);
  }
});

/* Función para mostrar los resultados de la búsqueda */
function mostrarResultados(resultados) {
  searchResults.style.display = "block"; // Mostrar los resultados
  searchResults.innerHTML = resultados;
}

/* Función para limpiar los resultados */
function limpiarResultados() {
  searchResults.style.display = "none"; // Ocultar resultados
  searchResults.innerHTML = ""; // Limpiar resultados anteriores
}

/*------ Función para buscar la dimensión en la base de datos -----------*/
function buscarDimensionEnBaseDeDatos(nombreDimension) {
  // Crear un objeto XMLHttpRequest para la solicitud
  const xhr = new XMLHttpRequest();

  // Definir la URL del controlador de búsqueda de dimensiones
  const url = `/dimensiones/buscar?dimension=${encodeURIComponent(
    nombreDimension
  )}`;

  // Establecer el método de solicitud y la URL
  xhr.open("GET", url, true);

  // Definir una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    mostrarResultados();
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        const respuesta = xhr.responseText;
        try {
          // Intentar parsear la respuesta como JSON
          const dimensionInfo = JSON.parse(respuesta);
          // mostrarResultados();
          // Verificar si la respuesta contiene una dimensión (lo que significa que la dimensión fue encontrada)
          if (dimensionInfo.dimension) {
            // La dimensión existe,graba el valor del id en el input invisible

            dimensionIdField.value = dimensionInfo.id_dimension;
            //  Muestra los resultados
            searchResults.innerHTML =
              "Dimensión encontrada en la base de datos: " +
              dimensionInfo.dimension;
            findDimensionButton.textContent = "Buscar";
            dimensionNameField.setAttribute("readonly", "");
            modifyDimensionButton.disabled = false;
          }
        } catch (error) {
          // Error al parsear la respuesta JSON
          console.error("Error al parsear la respuesta JSON: " + error);
          searchResults.innerHTML = "Error al buscar la dimensión.";
        }
      } else if (xhr.status === 404) {
        // La dimensión no fue encontrada
        console.log("Dimension no encontrada");
        searchResults.innerHTML =
          "La dimensión no fue encontrada en la base de datos.";
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        // Aquí puedes mostrar un mensaje de error más específico si lo deseas
        searchResults.innerHTML = "Error al buscar la dimensión.";
      }
    } /* else {
      // Ocurrió un error en la solicitud
      console.error("Error en la solicitud AJAX: " + xhr.status);
      // Aquí puedes mostrar un mensaje de error más específico si lo deseas
      searchResults.innerHTML = "Error al buscar la dimensión.";
    } */
  };

  // Enviar la solicitud al servidor
  xhr.send();
}

/* ============Botón Modificar==================================== */
modifyDimensionButton.addEventListener("click", () => {
  if (modifyDimensionButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    dimensionNameField.removeAttribute("readonly");
    modifyDimensionButton.textContent = "Aceptar";
  } else {
    // Obtener el nombre de la dimensión y la nueva descripción
    const nuevaDimension = dimensionNameField.value;

    // Asegurarse de tener valores válidos antes de continuar
    if (!esCadenaNoVacia(nuevaDimension)) {
      errorMessage.textContent =
        "Por favor, busque una dimensión antes de modificar o ingrese una descripción válida.";
      return;
    }

    // Verificar si la nueva dimensión ya existe en la base de datos de forma asíncrona
    verificarDimensionExistente(nuevaDimension, function (dimensionExiste) {
      console.log(`Variable nueva dimension: ${nuevaDimension}`);
      console.log(`variable dimensionExiste = ${dimensionExiste}`);
      if (dimensionExiste) {
        // La nueva dimensión ya existe
        errorMessage.textContent =
          "La nueva dimensión ya está siendo utilizada. Por favor, elija otra.";
      } else {
        // Realizar la actualización de la descripción en la base de datos
        dimensionId = parseInt(dimensionIdField.value);
        actualizarDescripcionEnBaseDeDatos(dimensionId, nuevaDimension);
      }
    });
  }
});

/* ==================Función Actualizar la descripción de la dimensión============= */

function actualizarDescripcionEnBaseDeDatos(dimensionId, nuevaDimension) {
  // Crear un objeto XMLHttpRequest para la solicitud
  var xhr = new XMLHttpRequest();

  // Definir la URL del controlador que actualizará la descripción en la base de datos
  var url = `/dimensiones/${dimensionId}`;

  // Establecer el método de solicitud y la URL
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // Define una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        var respuesta = xhr.responseText;
        if (respuesta === "La dimensión se ha actualizado con éxito.") {
          // La descripción se actualizó con éxito
          searchResults.innerHTML = "Dimensión actualizada con éxito.";
          modifyDimensionButton.textContent = "Modificar";
          dimensionNameField.setAttribute("readonly", "");
        } else {
          // Ocurrió un error al actualizar la descripción
          alert("Error al actualizar la dimensión. Inténtelo nuevamente.");
        }
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        alert("Error al actualizar la dimensión. Inténtelo nuevamente.");
      }
    }
  };

  // Crear un objeto Dimension con la nueva descripción
  var nuevaDimensionObj = {
    dimension: nuevaDimension,
  };

  // Enviar los datos del formulario al controlador
  xhr.send(JSON.stringify(nuevaDimensionObj));
}

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  dimensionNameField.value = "";
  dimensionNameField.setAttribute("readonly", "");
  newDimensionButton.textContent = "Agregar";
  findDimensionButton.textContent = "Buscar";
  errorMessage.textContent = "";
  modifyDimensionButton.disabled = true;
  limpiarResultados();
});

/* =============Función verificar dimensión existente ====================*/
function verificarDimensionExistente(nuevaDimension, callback) {
  // Crear un objeto XMLHttpRequest para la solicitud
  var xhr = new XMLHttpRequest();

  // Definir la URL del controlador que verifica la existencia de la dimensión
  var url = `/dimensiones/buscar?dimension=${encodeURIComponent(
    nuevaDimension
  )}`;

  // Establecer el método de solicitud y la URL
  xhr.open("GET", url, true);

  // Definir una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito

        // La dimensión ya existe
        callback(true);
      } else if (xhr.status === 404) {
        // La dimensión no fue encontrada

        callback(false);
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        callback(true); // Tratamos los errores como "dimensión existe"
      }
    }
  };

  // Enviar la solicitud al servidor
  xhr.send();
}

/* ============función verificar si una variable contiene una cadena================ */
function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}
