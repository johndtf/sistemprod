// inspeccion.js
import apiUrl from "./config.js";
import { insertarContenedorAlerta, mostrarAlerta } from "./funcionesComunes.js";

// ================== Variables globales ==================
let resoluciones = []; // Aquí se almacenarán las resoluciones cargadas desde el backend

// ======= Referencias a campos del formulario =======
const tiqueteInput = document.getElementById("tiquete");
const codinspSelect = document.getElementById("codinsp");
const resolinspectInput = document.getElementById("resolinspect");
const observacionInput = document.getElementById("observacion");
const reencauchesInput = document.getElementById("reencauches");
const fechaProcesoInput = document.getElementById("fechaProceso");

const tiqueteInfoField = document.getElementById("tiquete-info");
const observacionInicialField = document.getElementById("observacion-inicial");
const ordenField = document.getElementById("orden");
const clienteField = document.getElementById("cliente");
const marcaField = document.getElementById("marca");
const dimensionField = document.getElementById("dimension");
const disenoField = document.getElementById("diseno");
const serieField = document.getElementById("serie");
const estadoField = document.getElementById("estadol");
const nivelField = document.getElementById("nivell");
const resolucionField = document.getElementById("resolucionl");
const operarioInput = document.getElementById("operario");
const operarioDisplay = document.getElementById("operario-display");

const actualizarBtn = document.querySelector(".inspect-llanta-btn");
const deshacerBtn = document.querySelector(".cancel-inspect-btn");

// ================== Al cargar la página ==================
document.addEventListener("DOMContentLoaded", function () {
  // ======= Barra lateral =======
  const toggleDescriptionBtn = document.querySelector(".toggle-description");
  const menuItems = document.querySelectorAll(".menu li");
  const spanToggle = document.querySelector(".span-toggle");
  const spanLogo = document.querySelector(".span-logo");

  toggleDescriptionBtn.addEventListener("click", function () {
    menuItems.forEach((item) => {
      const description = item.querySelector(".description");
      description.classList.toggle("show");
      spanToggle.classList.toggle("show");
      spanLogo.classList.toggle("show");
    });
  });

  // ======= Cargar resoluciones de inspección =======
  async function loadResolutions() {
    try {
      const token = localStorage.getItem("myTokenName");

      const response = await fetch(`${apiUrl}/api/resolutionsInsp/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        resoluciones = await response.json();

        // Limpiar opciones previas
        codinspSelect.innerHTML = "";

        // Cargar opciones al select con id_inspec como valor
        resoluciones.forEach((r) => {
          const option = document.createElement("option");
          option.value = r.id_inspec; // ✅ usar id_inspec real
          option.textContent = r.codigo;
          codinspSelect.appendChild(option);
        });

        // Seleccionar por defecto la opción "A" (APTA)
        const defaultResol = resoluciones.find((r) => r.codigo === "A");
        if (defaultResol) {
          codinspSelect.value = defaultResol.id_inspec;
          resolinspectInput.value = defaultResol.resol_inspec;
        }
      } else {
        mostrarAlerta(
          "Error",
          "No se pudieron cargar las resoluciones",
          "error",
        );
      }
    } catch (error) {
      console.error("Error de red:", error);
      mostrarAlerta("Error", "Fallo de conexión con el servidor", "error");
    }

    /* carga la fecha y hora actuales */
    const ahora = new Date();
    fechaProceso.value = ahora.toISOString().slice(0, 16);
  }

  // ======= Actualizar descripción de inspección cuando cambia el código =======
  codinspSelect.addEventListener("change", () => {
    const selected = resoluciones.find(
      (r) => r.id_inspec == codinspSelect.value,
    );
    resolinspectInput.value = selected ? selected.resol_inspec : "";
  });

  // Cargar resoluciones al iniciar
  loadResolutions();

  // ======= Cargar información de llanta por tiquete =======
  async function cargarLlantaPorTiquete(tiquete) {
    if (!tiquete) {
      limpiarDatosLlanta();
      return;
    }
    try {
      const token = localStorage.getItem("myTokenName");
      const res = await fetch(`${apiUrl}/api/tires/${tiquete}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        limpiarDatosLlanta();

        mostrarAlerta("Advertencia", "No se encontró la llanta", "warning");
        tiqueteInput.focus();
        tiqueteInput.select();
        return;
      }

      const llanta = await res.json();

      // ======= Llenar campos de información =======
      tiqueteInfoField.value = llanta.id_llanta || "";
      observacionInicialField.value = llanta.observaciones_inicial || "";
      ordenField.value = llanta.orden || "";
      clienteField.value =
        (llanta.cliente_nombre + " " + llanta.cliente_apellido).trim() || "";
      marcaField.value = llanta.marca || "";
      dimensionField.value = llanta.dimension || "";
      disenoField.value = llanta.diseno || "";
      serieField.value = llanta.serie || "";
      estadoField.value = llanta.estado || "";
      nivelField.value = llanta.nivel_reenc || "";
      resolucionField.value = llanta.resol_inspec || "";

      // ======= Actualizar subprocesos completados =======
      menuItems.forEach((item) => item.classList.remove("completed"));
      if (llanta.subprocesos && Array.isArray(llanta.subprocesos)) {
        llanta.subprocesos.forEach((sub) => {
          const li = Array.from(menuItems).find(
            (li) => li.querySelector(".description").textContent === sub,
          );
          if (li) li.classList.add("completed");
        });
      }
    } catch (error) {
      console.error("Error cargando llanta:", error);
      limpiarDatosLlanta();
      mostrarAlerta("Error", "Problema de conexión con el servidor", "error");

      tiqueteInput.focus();
      tiqueteInput.select();
    }
  }

  // ✅ Ejecutar carga al perder el foco (en lugar de 'change')
  tiqueteInput.addEventListener("blur", async () => {
    const tiquete = tiqueteInput.value.trim();
    await cargarLlantaPorTiquete(tiquete);
  });

  // ======= Actualizar nombre del operario cuando se digita el código =======
  operarioInput.addEventListener("blur", async () => {
    const codigo = operarioInput.value.trim();

    if (!codigo) {
      operarioDisplay.value = "";
      return;
    }

    try {
      const token = localStorage.getItem("myTokenName");

      const response = await fetch(`${apiUrl}/api/employees/code/${codigo}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        operarioDisplay.value = "Empleado no encontrado";
        return;
      }

      const empleado = await response.json();

      operarioDisplay.value = empleado.nombre;
    } catch (error) {
      console.error(error);
      operarioDisplay.value = "Error de consulta";
    }
  });

  // ======= Limpiar campos de información  =======
  function limpiarDatosLlanta() {
    tiqueteInfoField.value = "";
    observacionInicialField.value = "";
    ordenField.value = "";
    clienteField.value = "";
    marcaField.value = "";
    dimensionField.value = "";
    disenoField.value = "";
    serieField.value = "";
    estadoField.value = "";
    nivelField.value = "";
    resolucionField.value = "";

    // Limpiar indicadores de subproceso
    menuItems.forEach((item) => item.classList.remove("completed"));
  }
  // ======= Actualizar inspección inicial =======

  actualizarBtn.addEventListener("click", async () => {
    const tiquete = tiqueteInput.value.trim();
    const nivelReenc = parseInt(reencauchesInput.value.trim());
    const idOperario = operarioInput.value.trim();

    if (!tiquete) {
      mostrarAlerta("Atención", "Debe digitar un tiquete válido", "warning");
      tiqueteInput.focus();
      return;
    }

    if (isNaN(nivelReenc) || nivelReenc < 1) {
      mostrarAlerta(
        "Atención",
        "El nivel de reencauche debe ser un número entero mayor o igual a 1",
        "warning",
      );
      reencauchesInput.focus();
      return;
    }
    if (isNaN(idOperario) || idOperario < 1) {
      mostrarAlerta(
        "Atención",
        "Debe digitar un código de operario válido",
        "warning",
      );

      operarioInput.focus();
      return;
    }

    const payload = {
      nivel_reenc: nivelReenc,
      id_inspec: parseInt(codinspSelect.value),
      observaciones_inicial: observacionInput.value,
      id_inspector: idOperario, //
      fecha_inspeccion_inicial: fechaProcesoInput.value,
    };

    // Deshabilitar botón mientras se procesa la solicitud
    actualizarBtn.disabled = true;
    actualizarBtn.textContent = "Actualizando...";

    try {
      const token = localStorage.getItem("myTokenName");

      const response = await fetch(
        `${apiUrl}/api/initialInspection/${tiquete}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        mostrarAlerta(
          "Éxito",
          "Inspección actualizada correctamente",
          "success",
        );
        // 🔄 Recargar información actualizada
        await cargarLlantaPorTiquete(tiquete);

        // habilitar botón nuevamente
        actualizarBtn.disabled = false;
        actualizarBtn.textContent = "Actualizar";
      } else {
        let errorMsg = "No se pudo actualizar la inspección.";
        try {
          const err = await response.json();
          if (err.message) errorMsg = err.message;
        } catch {}
        mostrarAlerta("Error", errorMsg, "error");
      }
    } catch (error) {
      console.error("Error en actualización:", error);
      mostrarAlerta("Error", "Problema de conexión con el servidor", "error");
    }
  });

  // ======= Deshacer Inspección =======

  deshacerBtn.addEventListener("click", async () => {
    const tiquete = tiqueteInput.value.trim();

    if (!tiquete) {
      mostrarAlerta("Atención", "Debe seleccionar una llanta", "warning");
      return;
    }

    // Confirmación antes de deshacer
    const confirmDeshacer = confirm(
      "¿Está seguro de que desea deshacer la inspección inicial? Esta acción no se puede deshacer.",
    );
    if (!confirmDeshacer) return;

    // Deshabilitar botón mientras se procesa la solicitud
    deshacerBtn.disabled = true;
    deshacerBtn.textContent = "Deshaciendo...";

    try {
      const token = localStorage.getItem("myTokenName");

      const response = await fetch(
        `${apiUrl}/api/initialInspection/${tiquete}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta("Error", data.message, "error");
        return;
      }

      mostrarAlerta("Éxito", data.message, "success");

      // Habilitar botón nuevamente
      deshacerBtn.disabled = false;
      deshacerBtn.textContent = "Deshacer Inspección";

      await cargarLlantaPorTiquete(tiquete);
      // Limpiar campos de captura
      reencauchesInput.value = 1;
      observacionInput.value = "";
      operarioInput.value = "";
      operarioDisplay.value = "";
    } catch (error) {
      console.error(error);

      mostrarAlerta("Error", "Problema de conexión con el servidor", "error");
    }
  });

  // ======= Insertar contenedor de alerta =======
  insertarContenedorAlerta();
});
