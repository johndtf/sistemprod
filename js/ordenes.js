/* --------Tabla - Check de la cabecera ------------------------------ */
// Obtener el elemento de la cabecera de la columna
var checkAll = document.getElementById("checkAll");

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