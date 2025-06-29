import apiUrl from "./config.js";

// ------------------- Variables globales -------------------

let tomSelectCliente = null;

const checkAll = document.getElementById("checkAll");
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
const btnModificarLlanta = document.getElementById("btnModificarLlanta");
const btnAgregarLlanta = document.getElementById("btnAgregarLlanta");
const btnImprimir = document.getElementById("btnImprimir");
const btnCancelarOrden = document.getElementById("btnCancelarOrden");

// ------------------- Funciones -------------------

// Check de cabecera
checkAll.addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("td input[type=checkbox]");
  checkboxes.forEach((cb) => (cb.checked = checkAll.checked));
});

// Mostrar última orden
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
      ordenField.value = data.orden.numero_orden;
      fechaField.value = data.orden.fecha;
      cedulaField.value = data.orden.cedula_nit;
      clienteField.value = data.orden.nombre_cliente;
      telefonoField.value = data.orden.telefono;
      direccionField.value = data.orden.direccion;
    } else if (response.status === 404) {
      console.log("No hay órdenes registradas aún.");
    }
  } catch (error) {
    console.error("Error al cargar la última orden:", error);
  }
}

// Preparar nueva orden
function prepararNuevaOrden() {
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
  btnImprimir.disabled = true;

  btnAgregarOrden.textContent = "Aceptar";
}

// Cancelar nueva orden
function cancelarNuevaOrden() {
  clienteSelectContainer.classList.add("hidden");
  cedulaContainer.classList.remove("hidden");
  clienteContainer.classList.remove("hidden");

  ordenField.setAttribute("readonly", true);
  fechaField.setAttribute("readonly", true);
  telefonoField.setAttribute("readonly", true);
  direccionField.setAttribute("readonly", true);

  marcaField.disabled = true;
  dimensionField.disabled = true;
  disenoField.disabled = true;
  serieField.disabled = true;
  prioridadField.disabled = true;
  observacionField.disabled = true;

  serieField.value = "";
  observacionField.value = "";

  btnAgregarOrden.textContent = "Agregar";
  btnModificarOrden.disabled = false;
  btnbuscarOrden.disabled = false;
  btnAgregarLlanta.disabled = false;
  btnModificarLlanta.disabled = false;
  btnImprimir.disabled = false;

  // Mostrar última orden
  mostrarUltimaOrden();
}

// ------------------- Cargar al iniciar -------------------

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
  tomSelectCliente = new TomSelect("#clienteSelect", {
    valueField: "id_cliente",
    labelField: "nombre",
    searchField: ["nombre", "cedula_nit"],
    maxOptions: 10,
    loadThrottle: 300,
    placeholder: "Buscar cliente...",
    preload: false,
    load: function (query, callback) {
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
        .then((res) => res.json())
        .then(callback)
        .catch(() => callback());
    },
    onChange: function (value) {
      const cliente = this.options[value];
      if (cliente) {
        telefonoField.value = cliente.telefono;
        direccionField.value = cliente.direccion;
        cedulaField.value = cliente.cedula_nit;
        clienteField.value = cliente.nombre;
      }
    },
  });

  // Mostrar última orden
  mostrarUltimaOrden();

  // Botón agregar
  btnAgregarOrden.addEventListener("click", () => {
    if (btnAgregarOrden.textContent === "Agregar") {
      prepararNuevaOrden();
    } else {
      console.log("Registrar nueva orden...");
      marcaField.disabled = false;
      dimensionField.disabled = false;
      disenoField.disabled = false;
      serieField.disabled = false;
      prioridadField.disabled = false;
      observacionField.disabled = false;
    }
  });

  // Botón cancelar
  btnCancelarOrden.addEventListener("click", cancelarNuevaOrden);
});
