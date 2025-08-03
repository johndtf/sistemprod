import apiUrl from "./config.js";

import { insertarContenedorAlerta, mostrarAlerta } from "./funcionesComunes.js";
// Asegurarse de que el contenedor de alerta esté presente

// ------------------- Variables globales -------------------

let tomSelectCliente = null;
let ordenPrevia = null;

const checkAll = document.getElementById("checkAll");
const consecOrdenField = document.getElementById("consecOrden");
const marcaField = document.getElementById("marca");
const dimensionField = document.getElementById("dimension");
const disenoField = document.getElementById("diseno");
const serieField = document.getElementById("serie");
const prioridadField = document.getElementById("prioridad");
const observacionField = document.getElementById("observacion");
const clienteSelect = document.getElementById("clienteSelect");
const cedulaField = document.getElementById("cedula");
const clienteField = document.getElementById("cliente");
const clienteContainer = document.getElementById("clienteContainer");
const cedulaContainer = document.getElementById("cedulaContainer");
const clienteSelectContainer = document.getElementById(
  "clienteSelectContainer"
);
const ordenField = document.getElementById("orden");
const fechaField = document.getElementById("fecha");
const telefonoField = document.getElementById("telefono");
const direccionField = document.getElementById("direccion");
const tbody = document.querySelector(".llantas-table tbody");

const btnAgregarOrden = document.getElementById("btnAgregarOrden");
const btnModificarOrden = document.getElementById("btnModificarOrden");
const btnbuscarOrden = document.getElementById("btnBuscarOrden");
const btnCancelarOrden = document.getElementById("btnCancelarOrden");
const btnAgregarLlanta = document.getElementById("btnAgregarLlanta");
const btnModificarLlanta = document.getElementById("btnModificarLlanta");
const btnCancelarLlanta = document.getElementById("btnCancelarLlanta");
const btnCambiarOrdenLlanta = document.getElementById("btnCambiarOrdenLlanta");
// Botón para imprimir la orden
const btnImprimir = document.getElementById("btnImprimir");

// ===================== Funciones ===================

// --------------------Check de cabecera ---------------------

checkAll.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".llanta-checkbox");
  checkboxes.forEach((cb) => (cb.checked = checkAll.checked));
  actualizarEstadoBotonesLlantas();
});

// --------Función que actualiza el estado de botones llantas según la cantidad de checkboxes seleccionados----------
function actualizarEstadoBotonesLlantas() {
  const checkboxes = document.querySelectorAll(".llanta-checkbox");
  const seleccionados = Array.from(checkboxes).filter((cb) => cb.checked);

  btnModificarLlanta.disabled = seleccionados.length !== 1;
  btnCambiarOrdenLlanta.disabled = seleccionados.length === 0;
  btnImprimir.disabled = seleccionados.length === 0;
}

// Escuchamos eventos en todos los checkboxes de la tabla
tbody.addEventListener("change", (event) => {
  if (event.target.classList.contains("llanta-checkbox")) {
    actualizarEstadoBotonesLlantas();
  }
});

// --------------------Inicializar Tom Select para cliente---------------------
// Esta función inicializa Tom Select para el campo de cliente y permite buscar clientes por nombre o cédula/NIT.
// Si se selecciona un cliente, se ejecuta la función onClienteSeleccionado con el cliente seleccionado.
// Si ya existe una instancia previa de Tom Select, se destruye antes de crear una nueva

function inicializarTomSelectCliente(onClienteSeleccionado) {
  const clienteSelect = document.getElementById("clienteSelect");

  // Si ya existe una instancia previa, destrúyela antes de crear una nueva
  if (clienteSelect.tomselect) {
    clienteSelect.tomselect.destroy();
  }

  // --------Crear nueva instancia de Tom Select y asignarla como propiedad del select------
  clienteSelect.tomselect = new TomSelect(clienteSelect, {
    valueField: "id_cliente",
    labelField: "nombre",
    searchField: ["nombre", "cedula_nit"],
    maxOptions: 10,
    loadThrottle: 300,
    placeholder: "Buscar cliente...",
    preload: false,
    load: function (query, callback) {
      const token = localStorage.getItem("myTokenName");
      if (!query.length) return callback();

      fetch(
        `${apiUrl}/api/customers/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      )
        .then((resp) => resp.json())
        .then((json) => callback(json))
        .catch(() => callback());
    },
    onChange: function (value) {
      const cliente = this.options[value];
      if (cliente && typeof onClienteSeleccionado === "function") {
        ordenField.dataset.idCliente = cliente.id_cliente; // Actualizar ID de cliente
        onClienteSeleccionado(cliente); // Teléfono y dirección
      }
    },
  });
}

function guardarEstadoActualOrden() {
  ordenPrevia = {
    numero_orden: ordenField.value,
    id_orden: ordenField.dataset.idOrden,
    id_cliente: ordenField.dataset.idCliente,
    fecha: fechaField.value,
    cedula_nit: cedulaField.value,
    nombre_cliente: clienteField.value,
    telefono: telefonoField.value,
    direccion: direccionField.value,
  };
}

// -----------------------Mostrar última orden------------------
async function mostrarUltimaOrden() {
  try {
    const token = localStorage.getItem("myTokenName");
    const response = await fetch(`${apiUrl}/api/orders/last`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      //console.log("Orden recibida:", data.orden, data.llantas);

      mostrarOrden(data.orden, data.llantas);
    } else if (response.status === 404) {
      console.log("No hay órdenes registradas aún.");
    }
  } catch (error) {
    console.error("Error al cargar la última orden:", error);
  }
}

// ------------------Preparar el formulario para agregar una nueva orden---------------------------
function prepararNuevaOrden() {
  // guardar la orden previa para restaurarla si es necesario
  guardarEstadoActualOrden();

  ordenField.value = "";
  fechaField.value = new Date().toISOString().split("T")[0];
  telefonoField.value = "";
  direccionField.value = "";

  ordenField.removeAttribute("readonly");
  fechaField.removeAttribute("readonly");

  cedulaContainer.classList.add("hidden");
  clienteContainer.classList.add("hidden");
  clienteSelectContainer.classList.remove("hidden");

  marcaField.disabled = true;
  dimensionField.disabled = true;
  disenoField.disabled = true;
  serieField.disabled = true;
  prioridadField.disabled = true;
  observacionField.disabled = true;

  serieField.value = "";
  observacionField.value = "";
  tbody.innerHTML = "";

  // Limpiar selección previa y dar foco
  if (tomSelectCliente) {
    tomSelectCliente.clear();
    tomSelectCliente.focus();
  }

  btnModificarOrden.disabled = true;
  btnbuscarOrden.disabled = true;
  btnAgregarLlanta.disabled = true;
  btnModificarLlanta.disabled = true;
  btnCambiarOrdenLlanta.disabled = true;
  btnImprimir.disabled = true;
  btnCancelarOrden.disabled = false;
  btnAgregarOrden.textContent = "Aceptar";
}

// ------------------------Cancelar orden--------------------
async function cancelarOrden() {
  //
  restaurarFormularioOrden();
  // pone los campos de orden en su estado original
  if (ordenPrevia) {
    ordenField.value = ordenPrevia.numero_orden;
    ordenField.dataset.idOrden = ordenPrevia.id_orden;
    ordenField.dataset.idCliente = ordenPrevia.id_cliente;
    fechaField.value = ordenPrevia.fecha;
    ordenField.disabled = false; // Habilitar campo de orden
    cedulaField.value = ordenPrevia.cedula_nit;
    clienteField.value = ordenPrevia.nombre_cliente;
    telefonoField.value = ordenPrevia.telefono;
    direccionField.value = ordenPrevia.direccion;

    buscarOrdenPorNumero(ordenField.value);
  }
}
// ------------------------Restaurar formulario de orden--------------------
// Esta función se llama para restaurar el formulario a su estado original
function restaurarFormularioOrden() {
  // Mostrar campos de cédula y cliente
  clienteSelectContainer.classList.add("hidden");
  cedulaContainer.classList.remove("hidden");
  clienteContainer.classList.remove("hidden");

  // Hacer los campos de encabezado solo lectura
  ordenField.setAttribute("readonly", true);
  fechaField.setAttribute("readonly", true);
  fechaField.disabled = false; // Habilitar campo de fecha
  telefonoField.setAttribute("readonly", true);
  direccionField.setAttribute("readonly", true);

  // Deshabilitar campos de llantas
  consecOrdenField.disabled = true;
  marcaField.disabled = true;
  dimensionField.disabled = true;
  disenoField.disabled = true;
  serieField.disabled = true;
  prioridadField.disabled = true;
  observacionField.disabled = true;

  // Limpiar campos de texto de llantas
  consecOrdenField.value = "";
  serieField.value = "";
  observacionField.value = "";

  // Limpiar selección de cliente (Tom Select)
  if (window.tomSelectCliente) {
    tomSelectCliente.clear();
  }

  // Restaurar botones

  btnAgregarOrden.textContent = "Agregar";
  btnbuscarOrden.textContent = "Buscar";
  btnModificarOrden.textContent = "Modificar";
  btnAgregarLlanta.textContent = "Agregar Llanta";
  btnModificarLlanta.textContent = "Modificar Llanta";
  btnCambiarOrdenLlanta.textContent = "Cambiar de Orden";

  btnAgregarOrden.disabled = false;
  btnModificarOrden.disabled = false;
  btnbuscarOrden.disabled = false;
  btnAgregarLlanta.disabled = false;
  btnModificarLlanta.disabled = true;
  btnCambiarOrdenLlanta.disabled = true;
  btnCancelarOrden.disabled = true;
  btnCancelarLlanta.disabled = true;
  btnImprimir.disabled = true;
}

// ------------------Preparar el formulario para modificar una orden---------------------------
function prepararModificarOrden() {
  // Guardar el estado actual de la orden para restaurarlo si es necesario
  guardarEstadoActualOrden();
  // Cambiar visibilidad: usar el clienteSelect en lugar del nombre y cédula
  clienteSelectContainer.classList.remove("hidden");
  //cedulaContainer.classList.add("hidden");
  // clienteContainer.classList.add("hidden");

  // Hacer editables los campos de orden y fecha
  ordenField.removeAttribute("readonly");
  fechaField.removeAttribute("readonly");

  // Deshabilitar botones que no se deben usar en este momento
  btnAgregarOrden.disabled = true;
  btnbuscarOrden.disabled = true;
  btnCancelarOrden.disabled = false; // Habilitar botón de cancelar
  btnAgregarLlanta.disabled = true;
  btnModificarLlanta.disabled = true;
  btnCambiarOrdenLlanta.disabled = true;
  btnImprimir.disabled = true;

  // Cambiar texto del botón
  btnModificarOrden.textContent = "Aceptar";

  // Inicializar Tom Select si no está inicializado
  inicializarTomSelectCliente((cliente) => {
    telefonoField.value = cliente.telefono;
    direccionField.value = cliente.direccion;
  });

  // Asignar el cliente actual al TomSelect
  const idClienteActual = ordenField.dataset.idCliente;
  if (idClienteActual) {
    clienteSelect.tomselect.setValue(idClienteActual);
  }

  // Enfocar en cliente
  clienteSelect.tomselect.focus();
}

// ------------------Función para modificar orden---------------------------
async function aceptarModificarOrden() {
  const token = localStorage.getItem("myTokenName");
  const idOrden = ordenField.dataset.idOrden; // Obtener ID de la orden desde el dataset
  const idCliente = ordenField.dataset.idCliente; // No depende del Tom Select
  const numeroOrden = ordenField.value.trim();
  const fecha = fechaField.value;

  if (!idCliente || !numeroOrden || !fecha) {
    mostrarAlerta(
      "Advertencia",
      "Por favor completa todos los campos requeridos",
      "warning"
    );

    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/orders/${idOrden}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numero_orden: numeroOrden,
        id_cliente: idCliente,
        fecha: fecha,
      }),
    });

    if (response.ok) {
      // Mostrar nuevamente la orden actualizada
      await buscarOrdenPorNumero(ordenField.value);
      ordenPrevia = null; // Limpiar la orden previa
      restaurarFormularioOrden();
    } else {
      const errorData = await response.json();

      mostrarAlerta("Error al actualizar la orden", errorData.message, "error");
      console.error("Error al aceptar modificar orden:", errorData.message);
    }
  } catch (error) {
    console.error("Error en aceptarModificarOrden:", error);
    mostrarAlerta("Error", "No se pudo modificar la orden", "error");
  }
}

//------------------------Función para mostrar en pantalla una orden específica---------------------------
function mostrarOrden(orden, llantas) {
  ordenField.value = orden.numero_orden;
  ordenField.dataset.idOrden = orden.id_orden;
  ordenField.dataset.idCliente = orden.id_cliente; // Guardar ID del cliente
  fechaField.value = orden.fecha.split("T")[0];
  cedulaField.value = orden.cedula_nit;
  clienteField.value = orden.nombre_cliente;
  telefonoField.value = orden.telefono;
  direccionField.value = orden.direccion;

  tbody.innerHTML = "";
  llantas.forEach((llanta, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${llanta.consec_orden}</td>
      <td>${llanta.tiquete}</td>
      <td>${llanta.marca}</td>
      <td>${llanta.dimension}</td>
      <td>${llanta.serie}</td>
      <td>${llanta.banda}</td>
      <td>${llanta.prioridad === 1 ? "Urgente" : "Normal"}</td>
      <td>${llanta.observacion}</td>
      <td><input type="checkbox" class="llanta-checkbox"></td>
    `;
    tbody.appendChild(row);
    row.dataset.idLlanta = llanta.tiquete; // Guardar ID de la llanta en el dataset
  });
  // Actualizar el estado de los botones de llantas
  actualizarEstadoBotonesLlantas();
}

// ------------------------Función para buscar orden por número---------------------------
async function buscarOrdenPorNumero(numero) {
  const token = localStorage.getItem("myTokenName");
  const response = await fetch(`${apiUrl}/api/orders/${numero}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    mostrarOrden(data.orden, data.llantas);
  } else {
    console.error("Orden no encontrada");
  }
}

// ------------------------Función Preparar para agregar una nueva llanta---------------------------
// Esta función prepara el formulario para agregar una nueva llanta a la orden actual

function prepararAgregarLlanta() {
  // Buscar último consecutivo visible en la tabla
  const filas = tbody.querySelectorAll("tr");
  let ultimoConsecutivo = 0;
  if (filas.length > 0) {
    const ultimaFila = filas[filas.length - 1];
    const consecutivoTexto = ultimaFila.children[0].textContent;
    ultimoConsecutivo = parseInt(consecutivoTexto, 10) || 0;
  }

  // Sugerir el siguiente consecutivo
  consecOrdenField.value = ultimoConsecutivo + 1;

  // Habilitar campos de llanta
  marcaField.disabled = false;
  dimensionField.disabled = false;
  disenoField.disabled = false;
  serieField.disabled = false;
  prioridadField.disabled = false;
  observacionField.disabled = false;
  consecOrdenField.disabled = false;

  // Limpiar campos

  serieField.value = "";
  observacionField.value = "";

  // Deshabilitar otros botones
  btnAgregarOrden.disabled = true;
  btnModificarOrden.disabled = true;
  btnbuscarOrden.disabled = true;
  btnModificarLlanta.disabled = true;
  btnCambiarOrdenLlanta.disabled = true;
  btnImprimir.disabled = true;

  // Activar botón cancelar
  btnCancelarLlanta.disabled = false;

  // Cambiar texto del botón
  btnAgregarLlanta.textContent = "Aceptar";
  marcaField.focus();
}

// ------------------------Registrar nueva llanta---------------------------

async function registrarLlanta() {
  const idOrden = ordenField.dataset.idOrden;

  const nuevaLlanta = {
    consec_orden: parseInt(consecOrdenField.value, 10) || 1,
    id_marca: marcaField.value,
    id_dimension: dimensionField.value,
    id_banda: disenoField.value,
    serie: serieField.value.trim(),
    prioridad: prioridadField.value,
    observacion: observacionField.value.trim(),
    id_orden: idOrden,
  };

  // Validar datos...
  if (
    !nuevaLlanta.id_marca ||
    !nuevaLlanta.id_dimension ||
    !nuevaLlanta.id_banda ||
    !nuevaLlanta.serie ||
    !nuevaLlanta.prioridad ||
    !nuevaLlanta.consec_orden
  ) {
    mostrarAlerta(
      "Advertencia",
      "Por favor completa todos los campos requeridos",
      "warning"
    );

    return;
  }

  try {
    const token = localStorage.getItem("myTokenName");
    const numeroOrden = ordenField.value;

    const response = await fetch(`${apiUrl}/api/orders/${numeroOrden}/tires`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaLlanta),
    });

    const data = await response.json();

    if (response.ok) {
      mostrarAlerta("Éxito", "Llanta agregada correctamente", "success");
      // Buscar la orden actualizada
      await buscarOrdenPorNumero(numeroOrden);
    } else {
      console.error("Error al agregar llanta:", data.message);
      mostrarAlerta(
        "Error",
        data.message || "No se pudo agregar la llanta",
        "error"
      );
    }
  } catch (error) {
    console.error("Error al agregar llanta:", error);

    mostrarAlerta("Error", "Error de conexión al agregar la llanta.", "error");
  }
}

// ------------------------Función para establecer el valor del select por texto---------------------------
// Esta función busca un option en el select por su texto visible y establece el valor del select
function setSelectValueByText(selectElement, text) {
  const option = Array.from(selectElement.options).find(
    (opt) => opt.textContent.trim() === text
  );
  if (option) selectElement.value = option.value;
}

// ------------------------Preparar para modificar una llanta---------------------------
// Esta función prepara el formulario para modificar una llanta existente en la orden actual

function prepararModificarLlanta() {
  // 1. Buscar la fila seleccionada
  const filas = Array.from(tbody.querySelectorAll("tr"));
  const filaSeleccionada = filas.find(
    (fila) => fila.querySelector("input[type='checkbox']").checked
  );

  if (!filaSeleccionada) {
    mostrarAlerta(
      "Advertencia",
      "Por favor selecciona una llanta para modificar.",
      "warning"
    );

    return;
  }

  // 2. Obtener id_llanta desde dataset
  const idLlanta = filaSeleccionada.dataset.idLlanta;
  if (!idLlanta) {
    // Si no se encontró el ID de la llanta, mostrar un mensaje de error
    console.error("No se encontró el ID de la llanta seleccionada.");
    mostrarAlerta(
      "Error",
      "No se encontró el ID de la llanta seleccionada.",
      "error"
    );
    return;
  }

  // 3. Guardar el id de la llanta en el botón o en variable global
  btnModificarLlanta.dataset.idLlanta = idLlanta;

  // 4. Obtener datos de la fila (usando celdas por índice)
  const celdas = filaSeleccionada.querySelectorAll("td");
  const consecOrden = celdas[0].textContent.trim();
  const serie = celdas[4].textContent.trim();
  const marcaNombre = celdas[2].textContent.trim();
  const dimensionNombre = celdas[3].textContent.trim();
  const disenoNombre = celdas[5].textContent.trim();
  const prioridad = celdas[6].textContent.trim() === "Urgente" ? 1 : 0; // Convertir a valor numérico
  const observacion = celdas[7].textContent.trim(); // 8va columna

  /*  console.log("Datos de la llanta seleccionada:", {
    consecOrden,
    serie,
    marcaNombre,
    dimensionNombre,
    disenoNombre,
    prioridad,
    observacion,
  }); */

  // 5. Habilitar los campos
  marcaField.disabled = false;
  dimensionField.disabled = false;
  disenoField.disabled = false;
  serieField.disabled = false;
  prioridadField.disabled = false;
  observacionField.disabled = false;

  // 6. Establecer los valores en los campos del formulario
  consecOrdenField.value = consecOrden;
  serieField.value = serie;
  observacionField.value = observacion;

  // Buscar los valores por texto visible en los select (marca, dimensión, banda)
  setSelectValueByText(marcaField, marcaNombre);
  setSelectValueByText(dimensionField, dimensionNombre);
  setSelectValueByText(disenoField, disenoNombre);
  prioridadField.value = prioridad; // Asignar prioridad como valor numérico

  // 7. Preparar el formulario para modificar la llanta
  btnAgregarOrden.disabled = true;
  btnModificarOrden.disabled = true;
  btnbuscarOrden.disabled = true;
  btnAgregarLlanta.disabled = true;
  btnCambiarOrdenLlanta.disabled = true;
  btnImprimir.disabled = true;

  btnModificarLlanta.textContent = "Aceptar";
  btnCancelarLlanta.disabled = false;
  consecOrdenField.focus();
}

// ------------------------Imprimir llantas seleccionadas---------------------------
function imprimirLlantasSeleccionadas() {
  const checkboxes = document.querySelectorAll(".llanta-checkbox");

  const filasSeleccionadas = Array.from(checkboxes)
    .map((checkbox) => {
      if (checkbox.checked) {
        return checkbox.closest("tr");
      }
      return null;
    })
    .filter((fila) => fila !== null);

  if (filasSeleccionadas.length === 0) {
    mostrarAlerta(
      "Advertencia",
      "Por favor selecciona al menos una llanta para imprimir.",
      "warning"
    );
    return;
  }

  // Obtener datos de la orden
  const numeroOrden = ordenField.value;
  const fecha = fechaField.value;
  const cedula = cedulaField.value;
  const cliente = clienteField.value;
  const telefono = telefonoField.value;
  const direccion = direccionField.value;

  // Construir HTML para impresión
  let contenido = `
    <html>
    <head>
      <title>Orden ${numeroOrden}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        .info-orden {
          margin-bottom: 20px;
        }
        .info-orden strong {
          display: inline-block;
          width: 120px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #000;
          padding: 6px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <h2>Orden de Trabajo #${numeroOrden}</h2>
      <div class="info-orden">
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Cédula/NIT:</strong> ${cedula}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cons.</th>
            <th>Tiquete</th>
            <th>Marca</th>
            <th>Dimensión</th>
            <th>Serie</th>
            <th>Banda</th>
            <th>Prioridad</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
  `;

  filasSeleccionadas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    contenido += "<tr>";
    for (let i = 0; i < 8; i++) {
      contenido += `<td>${celdas[i].textContent}</td>`;
    }
    contenido += "</tr>";
  });

  contenido += `
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  // Abrir ventana e imprimir
  const ventana = window.open("", "_blank", "width=900,height=600");
  ventana.document.open();
  ventana.document.write(contenido);

  ventana.document.close();
}

// ==================== Cargar al iniciar ===================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("myTokenName");

  // Cargar marcas
  fetch(`${apiUrl}/api/brands/brandslist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.id_marca;
        option.text = marca.marca;
        marcaField.appendChild(option);
      });
    });

  // Cargar dimensiones
  fetch(`${apiUrl}/api/dimensions/dimensionslist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((dim) => {
        const option = document.createElement("option");
        option.value = dim.id_dimension;
        option.text = dim.dimension;
        dimensionField.appendChild(option);
      });
    });

  // Cargar diseños
  fetch(`${apiUrl}/api/treads/treadlist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((banda) => {
        const option = document.createElement("option");
        option.value = banda.id_banda;
        option.text = banda.banda;
        disenoField.appendChild(option);
      });
    });

  // Inicializar Tom Select
  inicializarTomSelectCliente((cliente) => {
    telefonoField.value = cliente.telefono;
    direccionField.value = cliente.direccion;
  });

  // Mostrar última orden
  mostrarUltimaOrden();

  // ================== Botón agregar nueva Orden==================

  btnAgregarOrden.addEventListener("click", async () => {
    if (btnAgregarOrden.textContent === "Agregar") {
      prepararNuevaOrden();
    } else {
      // Registrar la nueva orden
      const numeroOrden = ordenField.value.trim();
      const fecha = fechaField.value;
      const clienteId = clienteSelect.value;

      if (!numeroOrden || !fecha || !clienteId) {
        mostrarAlerta(
          "Advertencia",
          "Por favor completa todos los campos requeridos",
          "warning"
        );
        return;
      }

      const nuevaOrden = {
        numero_orden: numeroOrden,
        fecha,
        id_cliente: clienteId,
      };

      try {
        const token = localStorage.getItem("myTokenName");
        const response = await fetch(`${apiUrl}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaOrden),
        });

        const data = await response.json();

        if (response.ok) {
          mostrarAlerta("Éxito", "Orden registrada correctamente", "success");

          restaurarFormularioOrden();
          ordenPrevia = null;
          // Volver a cargar la última orden
          mostrarUltimaOrden();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error al registrar la orden:", error);
        mostrarAlerta("Error", "No se pudo registrar la orden", "error");
      }
    }
  });

  // ================== Botón Buscar Orden==================
  btnbuscarOrden.addEventListener("click", async () => {
    if (btnbuscarOrden.textContent === "Buscar") {
      // Preparar pantalla para búsqueda
      // Guardar el estado actual de la orden para restaurarlo si es necesario
      guardarEstadoActualOrden();
      ordenField.removeAttribute("readonly");
      fechaField.disabled = true; // Deshabilitar campo de fecha
      ordenField.value = "";
      ordenField.focus();

      // Deshabilitar otros botones
      btnAgregarOrden.disabled = true;
      btnModificarOrden.disabled = true;
      btnCancelarOrden.disabled = false; // Habilitar botón de cancelar
      btnAgregarLlanta.disabled = true;
      btnModificarLlanta.disabled = true;
      btnCambiarOrdenLlanta.disabled = true;
      // Deshabilitar botón de imprimir
      btnImprimir.disabled = true;

      btnbuscarOrden.textContent = "Aceptar";
    } else {
      // Ejecutar búsqueda
      const numeroOrden = ordenField.value.trim();
      if (!numeroOrden) {
        mostrarAlerta(
          "Número de orden requerido",
          "Por favor, ingresa un número de orden.",
          "warning"
        );
        return;
      }

      try {
        const token = localStorage.getItem("myTokenName");
        const response = await fetch(`${apiUrl}/api/orders/${numeroOrden}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          mostrarOrden(data.orden, data.llantas);

          restaurarFormularioOrden(); // Vuelve al estado normal
        } else if (response.status === 404) {
          mostrarAlerta(
            "Orden no encontrada",
            `La orden número ${numeroOrden} no existe.`,
            "warning"
          );
        } else {
          await handleErrorResponse(
            response,
            document.querySelector(".content-error")
          );
          document.getElementById("error-message").style.display = "block";
        }
      } catch (error) {
        console.error("Error al buscar orden:", error);
        // Mostrar alerta de error
        mostrarAlerta(
          "Error de conexión",
          "No se pudo conectar con el servidor.",
          "error"
        );
      }
    }
  });

  // ================== Botón Modificar Orden==================
  btnModificarOrden.addEventListener("click", () => {
    if (btnModificarOrden.textContent === "Modificar") {
      prepararModificarOrden();
    } else {
      aceptarModificarOrden(); // función que hace el fetch
    }
  });

  // ======================Botón cancelar Orden==================

  btnCancelarOrden.addEventListener("click", cancelarOrden);

  // ================== Botón Agregar llanta==================

  btnAgregarLlanta.addEventListener("click", async () => {
    if (btnAgregarLlanta.textContent === "Agregar Llanta") {
      prepararAgregarLlanta();
    } else {
      await registrarLlanta();

      restaurarFormularioOrden();
    }
  });

  // ================== Botón Modificar Llanta==================

  btnModificarLlanta.addEventListener("click", async () => {
    if (btnModificarLlanta.textContent === "Modificar Llanta") {
      prepararModificarLlanta();
    } else {
      // Aceptar la modificación
      const idLlanta = btnModificarLlanta.dataset.idLlanta;
      const numeroOrden = ordenField.value.trim();

      const llantaModificada = {
        consec_orden: parseInt(consecOrdenField.value, 10) || 1,
        id_marca: marcaField.value,
        id_dimension: dimensionField.value,
        id_banda: disenoField.value,
        serie: serieField.value.trim(),
        prioridad: prioridadField.value,
        observacion: observacionField.value.trim(),
      };

      // Validación
      if (
        !llantaModificada.id_marca ||
        !llantaModificada.id_dimension ||
        !llantaModificada.id_banda ||
        !llantaModificada.serie ||
        !llantaModificada.prioridad
      ) {
        mostrarAlerta(
          "Advertencia",
          "Por favor completa todos los campos requeridos",
          "warning"
        );
        return;
      }

      try {
        const token = localStorage.getItem("myTokenName");
        const response = await fetch(`${apiUrl}/api/orders/tires/${idLlanta}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(llantaModificada),
        });

        const data = await response.json();

        if (response.ok) {
          // Mostrar mensaje de éxito
          mostrarAlerta("Éxito", "Llanta modificada correctamente", "success");

          // Buscar la orden actualizada

          await buscarOrdenPorNumero(numeroOrden);
          restaurarFormularioOrden();
        } else {
          console.error("Error al modificar llanta:", data.message);
          mostrarAlerta(
            "Error",
            data.message || "No se pudo modificar la llanta",
            "error"
          );
        }
      } catch (error) {
        console.error("Error al modificar llanta:", error);

        mostrarAlerta(
          "Error",
          "Error de conexión al modificar la llanta.",
          "error"
        );
      }
    }
  });

  // ================== Botón Cancelar llanta==================

  btnCancelarLlanta.addEventListener("click", () => {
    restaurarFormularioOrden();
  });

  // ================== Botón Cambiar Orden Llanta==================
  btnCambiarOrdenLlanta.addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(".llanta-checkbox:checked");

    if (checkboxes.length === 0) {
      mostrarAlerta(
        "Advertencia",
        "Por favor selecciona al menos una llanta para cambiar de orden.",
        "warning"
      );
      return;
    }

    const numeroOrdenDestino = prompt(
      "Ingresa el número de orden a la que deseas mover la(s) llanta(s):"
    )?.trim();

    if (!numeroOrdenDestino) {
      mostrarAlerta(
        "Advertencia",
        "Por favor ingresa un número de orden válido.",
        "warning"
      );
      return;
    }

    const numeroOrdenActual = ordenField.value.trim();

    if (numeroOrdenDestino === numeroOrdenActual) {
      mostrarAlerta(
        "Advertencia",
        "La orden destino debe ser diferente a la orden actual.",
        "warning"
      );
      return;
    }

    const confirmacion = confirm(
      `¿Estás seguro de que deseas mover ${checkboxes.length} llanta(s) a la orden ${numeroOrdenDestino}?`
    );
    if (!confirmacion) return;

    const llantasIds = Array.from(checkboxes).map((checkbox) => {
      const fila = checkbox.closest("tr");
      return fila.dataset.idLlanta;
    });

    try {
      const token = localStorage.getItem("myTokenName");

      const response = await fetch(`${apiUrl}/api/orders/reassign-tires`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numeroOrdenDestino,
          llantasIds,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarAlerta(
          "Éxito",
          "Llantas cambiadas de orden correctamente",
          "success"
        );

        // Mostrar orden destino con nuevas llantas
        buscarOrdenPorNumero(numeroOrdenDestino);
      } else {
        console.error("Error al cambiar llantas de orden:", data.message);
        mostrarAlerta(
          "Error",
          data.message || "No se pudo mover las llantas",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al cambiar llantas de orden:", error);
      mostrarAlerta(
        "Error",
        "Error de conexión al mover las llantas.",
        "error"
      );
    }
  });

  // ================== Detectar cambios en checkboxes de llantas==================
  tbody.addEventListener("change", (event) => {
    if (event.target.classList.contains("llanta-checkbox")) {
      actualizarEstadoBotonesLlantas();
    }
  });

  // ================== Botón Imprimir Llantas Seleccionadas==================
  btnImprimir.addEventListener("click", imprimirLlantasSeleccionadas);

  // ================== Insertar contenedor de alerta al cargar la página==================
  insertarContenedorAlerta();
});
