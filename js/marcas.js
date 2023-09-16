const newBrandButton = document.getElementById("newBrand-btn");
const cancelButton = document.getElementById("cancelBrand-btn");
const findBrandButton = document.getElementById("findBrand-btn");
const modifyBrandButton = document.getElementById("modifyBrand-btn");
const deleteBrandButton = document.getElementById("deleteBrand-btn");
const brandNameField = document.getElementById("brandName");
const errorMessage = document.getElementById("error-message");
const searchResults = document.getElementById("search-results");

/* Variables globales */
var nombreMarca = "";
var idMarcaEncontrada = null;
var descripcionMarcaEncontrada = null;

/* ===========Botón agrega marca=============================== */

newBrandButton.addEventListener("click", () => {
  if (newBrandButton.textContent.trim() === "Agregar") {
    // Preparar pantalla para ingreso de datos
    // deshabilita el botón de modificar
    modifyBrandButton.disabled = true;
    deleteBrandButton.disabled = true;
    brandNameField.removeAttribute("readonly");
    brandNameField.value = ""; // Limpiar el valor del campo
    newBrandButton.textContent = "Aceptar";
    brandNameField.focus();
  } else {
    // Obtener nombre de la nueva marca
    var nuevaMarca = brandNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nuevaMarca)) {
      errorMessage.textContent =
        "La marca debe contener una cadena de caractéres no vacía.";
      return;
    }

    // Verificar si la marca ya existe de forma asíncrona
    verificarMarcaExistente(nuevaMarca, function (marcaExiste) {
      if (marcaExiste) {
        // La marca ya existe
        errorMessage.textContent = "La marca ya existe. Por favor, elija otra.";
      } else {
        // Crear un objeto XMLHttpRequest para enviar una solicitud POST al servlet
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/SistemProdWeb/marca-crear", true);
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );

        // Define una función para manejar la respuesta del servidor
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // La solicitud se completó con éxito
              alert("Marca agregada con éxito.");
              brandNameField.setAttribute("readonly", "");
              newBrandButton.textContent = "Agregar";
              brandNameField.value = ""; // Limpiar el valor del campo
              errorMessage.textContent = "";
            } else {
              // Ocurrió un error en la solicitud
              alert("Error al agregar la marca. Inténtelo nuevamente.");
            }
          }
        };

        // Enviar los datos del formulario al servlet
        xhr.send("nuevaMarca=" + encodeURIComponent(nuevaMarca));
      }
    });
  }
});

/* =================Botón Encontrar========================== */
findBrandButton.addEventListener("click", () => {
  if (findBrandButton.textContent.trim() === "Buscar") {
    // Preparar pantalla para buscar una marca
    brandNameField.removeAttribute("readonly");
    brandNameField.value = ""; // Limpiar el valor del campo
    findBrandButton.textContent = "Aceptar";
    brandNameField.focus();
    searchResults.style.display = "none"; // Ocultar resultados anteriores
  } else {
    // Obtener nombre de la marca
    nombreMarca = brandNameField.value;

    /* Verifica que sea un nombre valido */
    if (!esCadenaNoVacia(nombreMarca)) {
      errorMessage.textContent =
        "La marca debe contener una cadena de caractéres no vacía.";
      return;
    }

    /* console.log("es un nombre de marca valido"); */
    /* Realizar la búsqueda de la marca en la base de datos */

    /* temporal para ver resultados */
    /* searchResults.style.display = "block"; */

    buscarMarcaEnBaseDeDatos(nombreMarca);
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

/* Función para buscar la marca en la base de datos */
function buscarMarcaEnBaseDeDatos(nombreMarca) {
  // Crear un objeto XMLHttpRequest para la solicitud
  const xhr = new XMLHttpRequest();

  // Definir la URL del servlet de búsqueda de marcas
  const url = "/SistemProdWeb/marca-buscar";

  // Establecer el método de solicitud y la URL
  xhr.open(
    "GET",
    url + "?nombreMarca=" + encodeURIComponent(nombreMarca),
    true
  );

  // Definir una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        const respuesta = xhr.responseText;
        console.log(`respuesta enviada por el servlet ${respuesta}`);
        try {
          // Intentar parsear la respuesta como JSON
          const marcaInfo = JSON.parse(respuesta);
          mostrarResultados();
          // Verificar si la respuesta contiene un ID (lo que significa que la marca fue encontrada)
          if (marcaInfo.id) {
            // Actualizar las variables globales con la información de la marca encontrada
            idMarcaEncontrada = marcaInfo.id;
            descripcionMarcaEncontrada = marcaInfo.marca;

            // La marca existe, muestra los resultados
            searchResults.innerHTML =
              "Marca encontrada en la base de datos: " + marcaInfo.marca;
            findBrandButton.textContent = "Buscar";
            brandNameField.setAttribute("readonly", "");
            // habilita el botón de modificar
            modifyBrandButton.disabled = false;
            deleteBrandButton.disabled = false;
            console.log("La marca se encontró");
          } else {
            // La marca no existe
            searchResults.innerHTML =
              "La marca no fue encontrada en la base de datos.";
            console.log("La marca no se encontró");
          }
        } catch (error) {
          // Error al parsear la respuesta JSON
          console.error("Error al parsear la respuesta JSON: " + error);
          searchResults.innerHTML = "Error al buscar la marca.";
        }
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        searchResults.innerHTML = "Error al buscar la marca.";
      }
    }
  };

  // Enviar la solicitud al servidor
  xhr.send();
}

/* ============Botón Modificar==================================== */
modifyBrandButton.addEventListener("click", () => {
  if (modifyBrandButton.textContent.trim() === "Modificar") {
    // Cambiar a modo de edición
    brandNameField.removeAttribute("readonly");
    modifyBrandButton.textContent = "Aceptar";
  } else {
    // Obtener el ID de la marca y la nueva descripción
    const idMarca = idMarcaEncontrada;
    const nuevaDescripcion = brandNameField.value;

    // Asegurarse de tener valores válidos antes de continuar
    if (!idMarca || !esCadenaNoVacia(nuevaDescripcion)) {
      errorMessage.textContent =
        "Por favor, busque una marca antes de modificar o ingrese una descripción válida.";
      return;
    }

    // Verificar si la nueva descripción ya existe en la base de datos de forma asíncrona
    verificarMarcaExistente(nuevaDescripcion, function (descripcionExiste) {
      if (descripcionExiste) {
        // La nueva descripción ya existe
        errorMessage.textContent =
          "La nueva descripción ya está siendo utilizada. Por favor, elija otra.";
      } else {
        // Realizar la actualización de la descripción en la base de datos
        actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion);
      }
    });
  }
});

/* ==================Función Actualizar la descripción de la marca============= */

function actualizarDescripcionEnBaseDeDatos(idMarca, nuevaDescripcion) {
  // Crear un objeto XMLHttpRequest para la solicitud
  var xhr = new XMLHttpRequest();

  // Definir la URL del servlet que actualizará la descripción en la base de datos
  var url = "/SistemProdWeb/marca-actualizar";

  // Establecer el método de solicitud y la URL
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Define una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        var respuesta = xhr.responseText;
        if (respuesta === "actualizado") {
          // La descripción se actualizó con éxito
          alert("Descripción actualizada con éxito.");
          brandNameField.setAttribute("readonly", "");
          modifyBrandButton.textContent = "Modificar";
          modifyBrandButton.disabled = true;
          brandNameField.value = ""; // Limpiar el valor del campo
          errorMessage.textContent = "";
        } else {
          // Ocurrió un error al actualizar la descripción
          alert("Error al actualizar la descripción. Inténtelo nuevamente.");
        }
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        alert("Error al actualizar la descripción. Inténtelo nuevamente.");
      }
    }
  };

  // Enviar los datos del formulario al servlet
  xhr.send(
    "idMarca=" +
      encodeURIComponent(idMarca) +
      "&nuevaDescripcion=" +
      encodeURIComponent(nuevaDescripcion)
  );
}

/* ==============Botón Eliminar ================================0 */

// Agregar un evento de clic al botón de eliminar
deleteBrandButton.addEventListener("click", () => {
  // Obtener el ID de la marca que se va a eliminar
  const idMarca = idMarcaEncontrada; // valor que se obtiene de la busqueda

  // Validar el ID de marca antes de continuar
  if (!idMarca) {
    errorMessage.textContent = "Por favor, busque una marca antes de eliminar.";
    return;
  }

  // Confirmar con el usuario antes de eliminar
  const confirmacion = confirm(
    "¿Está seguro de que desea eliminar esta marca?"
  );

  if (confirmacion) {
    // Realizar la eliminación de la marca en el servidor
    eliminarMarcaEnBaseDeDatos(idMarca);
  }
});

// Función para eliminar una marca en la base de datos
function eliminarMarcaEnBaseDeDatos(idMarca) {
  // Crear un objeto XMLHttpRequest para la solicitud
  var xhr = new XMLHttpRequest();

  // Definir la URL del servlet que eliminará la marca en la base de datos
  var url = "/SistemProdWeb/marca-eliminar"; // Reemplaza con la URL correcta

  // Establecer el método de solicitud y la URL
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Define una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        var respuesta = xhr.responseText;
        if (respuesta === "eliminado") {
          // La marca se eliminó con éxito
          alert("Marca eliminada con éxito.");
          // Realizar cualquier otra acción necesaria después de la eliminación
          // Por ejemplo, redireccionar a otra página o actualizar la lista de marcas
        } else {
          // Ocurrió un error al eliminar la marca
          alert("Error al eliminar la marca. Inténtelo nuevamente.");
        }
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        alert("Error al eliminar la marca. Inténtelo nuevamente.");
      }
    }
  };

  // Enviar los datos del formulario al servlet
  xhr.send("idMarca=" + encodeURIComponent(idMarca));
}

/* ============Botón Cancelar==================================== */
cancelButton.addEventListener("click", () => {
  brandNameField.value = "";
  brandNameField.setAttribute("readonly", "");
  newBrandButton.textContent = "Agregar";
  findBrandButton.textContent = "Buscar";
  errorMessage.textContent = "";
  // deshabilita el botón de modificar
  modifyBrandButton.disabled = true;
  deleteBrandButton.disabled = true;
  limpiarResultados();
});

/* =============0Función verificar marca existente ====================*/
function verificarMarcaExistente(nombreMarca, callback) {
  // Crear un objeto XMLHttpRequest para la solicitud
  var xhr = new XMLHttpRequest();

  // Definir la URL del servlet que verifica la existencia de la marca
  var url = "/SistemProdWeb/marca-verificar";

  // Establecer el método de solicitud y la URL
  xhr.open(
    "GET",
    url + "?nombreMarca=" + encodeURIComponent(nombreMarca),
    true
  );

  // Definir una función para manejar la respuesta del servidor
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // La solicitud se completó con éxito
        var respuesta = xhr.responseText;
        // console.log(respuesta);
        if (respuesta === "existe") {
          // La marca ya existe
          callback(true);
          //  console.log("marca encontrada");
        } else {
          // La marca no existe
          callback(false);
          //  console.log("Marca no encontrada");
        }
      } else {
        // Ocurrió un error en la solicitud
        console.error("Error en la solicitud AJAX: " + xhr.status);
        callback(true); // Tratamos los errores como "marca existe"
      }
    }
  };

  // Enviar la solicitud al servidor
  xhr.send();
}

/* ============función verificar si una variable contiene una cadena================0 */
function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}
