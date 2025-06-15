const checkAll = document.getElementById("checkAll");
const marcaField = document.getElementById("marca");
const dimensionField = document.getElementById("dimension");
const disenoField = document.getElementById("diseno");

import apiUrl from "./config.js";

/* --------Tabla - funcionamiento del Check de la cabecera ------------------------------ */
// Escuchar el evento click del elemento de la cabecera de la columna
checkAll.addEventListener("click", function () {
  // Obtener todos los elementos checkbox de la columna
  var checkboxes = document.querySelectorAll("td input[type=checkbox]");

  // Si el elemento de la cabecera de la columna está chequeado, chequear todos los elementos checkbox de la columna
  if (this.checked) {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
  } else {
    // Si el elemento de la cabecera de la columna no está chequeado, deschequear todos los elementos checkbox de la columna
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  }
});
/* -------------Fin Tabla - check de la cabecera----------------- */

/* =============Procedimientos después de cargar el formulario ============= */

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------Carga de marcas-------------------------- */
  // Realizar una solicitud al servidor para obtener la lista de marcas
  const token = localStorage.getItem("myTokenName");

  fetch(`${apiUrl}/api/brands/brandslist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Llenar dinámicamente el select con el listado de marcas

      data.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.id_marca; // Asigna el id de la marca
        option.text = marca.marca; // Asigna el nombre del perfil
        marcaField.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar marcas", error));

  /* --------------------------Carga de Dimensiones-------------------------- */
  // Realizar una solicitud al servidor para obtener la lista de dimensiones

  fetch(`${apiUrl}/api/dimensions/dimensionslist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Llenar dinámicamente el select con el listado

      data.forEach((dimension) => {
        const option = document.createElement("option");
        option.value = dimension.id_dimension;
        option.text = dimension.dimension;
        dimensionField.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar dimensiones", error));

  /* --------------------------Carga de Diseños-------------------------- */
  // Realizar una solicitud al servidor para obtener la lista de diseños

  fetch(`${apiUrl}/api/treads/treadlist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Llenar dinámicamente el select con el listado

      data.forEach((banda) => {
        const option = document.createElement("option");
        option.value = banda.id_banda;
        option.text = banda.banda;
        disenoField.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar dimensiones", error));
});
