//---------------Validar que sea una cadena no vacía------------------
export function esCadenaNoVacia(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

/*-----------Borrar el contenido de la tabla------------------------*/

export function cleanTable(tableBody) {
  while (tableBody.firstChild) {
    // Mientras haya nodos hijos en tbody, elimínalos
    tableBody.removeChild(tableBody.firstChild);
  }
}

// ----------Función para manejar respuestas no exitosas------------------
export async function handleErrorResponse(response, errorMessageElement) {
  let errorMsg = "Ocurrió un error en el servidor al hacer la consulta.";
  try {
    const data = await response.json();
    errorMsg = data.message || errorMsg; // Obtener el mensaje del backend si existe
  } catch (error) {
    console.error("Error al procesar la respuesta JSON:", error);
    errorMsg = "Error al procesar la respuesta del servidor.";
  }
  errorMessageElement.textContent = errorMsg; // Mostrar el mensaje de error
}
