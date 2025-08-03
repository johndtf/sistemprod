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

// -----------------Función para insertar un contenedor de alertas-----------------
// Esta función crea un contenedor para mostrar alertas en la parte superior derecha de la pantalla

// ======= Inserta el HTML de la alerta una sola vez =======

export function insertarContenedorAlerta() {
  if (!document.getElementById("alerta-toast")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div id="alerta-toast" class="toast-alert oculto">
        <div class="toast-icon" id="alerta-icono">ℹ️</div>
        <div class="toast-texto">
          <h4 id="toast-titulo">Título</h4>
          <p id="toast-mensaje">Mensaje</p>
        </div>
        <button id="cerrar-toast" class="toast-cerrar">×</button>
      </div>
      `
    );

    document.getElementById("cerrar-toast").addEventListener("click", () => {
      document.getElementById("alerta-toast").classList.remove("mostrar");
    });
  }
}

// ======= Mostrar alerta personalizada =======

// Ejemplo de uso:
/* mostrarAlerta("Éxito", "La llanta fue registrada correctamente", "success");
mostrarAlerta("Advertencia", "Campos incompletos en el formulario", "warning");
mostrarAlerta("Error", "No se pudo conectar con el servidor", "error");
mostrarAlerta("Información", "Cargando datos de la orden...", "info"); */

export function mostrarAlerta(titulo, mensaje, tipo = "info") {
  const alerta = document.getElementById("alerta-toast");
  const tituloEl = document.getElementById("toast-titulo");
  const mensajeEl = document.getElementById("toast-mensaje");
  const iconoEl = document.getElementById("alerta-icono");

  const iconos = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  if (!alerta || !tituloEl || !mensajeEl || !iconoEl) {
    console.error("Contenedor de alerta no encontrado");
    return;
  }

  // Resetear clases y texto
  alerta.className = "toast-alert";
  alerta.classList.add(`toast-${tipo}`);
  tituloEl.textContent = titulo;
  mensajeEl.textContent = mensaje;
  iconoEl.textContent = iconos[tipo] || "ℹ️";

  requestAnimationFrame(() => {
    alerta.classList.add("mostrar");
  });

  // Ocultar automáticamente después de 4 segundos
  /* setTimeout(() => {
    alerta.classList.remove("mostrar");
  }, 6000); */
}
