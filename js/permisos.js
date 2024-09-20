import apiUrl from "./config.js";
const perfilSelect = document.getElementById("perfil");
const succesResults = document.getElementById("success-results");
const actualizarBtn = document.getElementById("actualizar-permisos-btn");

document.addEventListener("DOMContentLoaded", () => {
  succesResults.innerHTML = "";

  /* --------------------------Carga de perfiles-------------------------- */

  // Realizar una solicitud al servidor para obtener la lista de perfiles
  fetch(`${apiUrl}/api/profiles/list`)
    .then((response) => response.json())
    .then((data) => {
      // Llenar dinámicamente el select con opciones de perfil

      data.forEach((perfil) => {
        const option = document.createElement("option");
        option.value = perfil.id_perfil; // Asigna el valor del perfil
        option.text = perfil.perfil; // Asigna el nombre del perfil
        perfilSelect.appendChild(option);
      });
      //después de cargar los perfiles, cargar los permisos del perfil en pantalla
      cargarPermisos();
    })
    .catch((error) => console.error("Error al cargar perfiles", error));

  // ===================== "Actualizar Permisos" ==============================
  actualizarBtn.addEventListener("click", async () => {
    const selectedPerfil = perfilSelect.value;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Obtener los permisos seleccionados
    const selectedPermisos = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    try {
      // Enviar la solicitud al servidor con los cambios
      const response = await fetch(`${apiUrl}/api/permisos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          perfil: selectedPerfil,
          permisos: selectedPermisos,
        }),
      });

      if (response.ok) {
        succesResults.innerHTML = "Permisos actualizados con éxito";
        setTimeout(() => {
          succesResults.innerHTML = " ";
        }, 2000);
      } else {
        console.error("Error al actualizar permisos");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});

//---------------Función para cargar permisos a perfil------------------

export async function cargarPermisos() {
  const selectedPerfil = perfilSelect.value;

  try {
    // Realizar una solicitud al backend para obtener los permisos del perfil
    const response = await fetch(`${apiUrl}/api/permisos/${selectedPerfil}`);

    if (response.ok) {
      const { permisos } = await response.json();

      // Marcar las casillas de verificación según los permisos obtenidos
      marcaCasillasSegunPermisos(permisos);
    } else {
      console.error("Error al obtener permisos del perfil");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

function marcaCasillasSegunPermisos(permisos) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Desmarcar todas las casillas
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Marcar las casillas según los permisos obtenidos
  permisos.forEach((permiso) => {
    const checkbox = document.querySelector(`input[value="${permiso}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

// ------Cuando haya un cambio en el select de los perfiles que se actualicen los permisos ------
perfilSelect.addEventListener("change", cargarPermisos);
