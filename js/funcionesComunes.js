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
