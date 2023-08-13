const newCustomerButton = document.getElementById("newCustomer-btn");
const fields = document.querySelectorAll(".form-group input[readonly]");
const customerNamesField = document.getElementById("customerNames"); // Obtener el campo de nombres de usuario
const customerStateField = document.getElementById("customerState");

newCustomerButton.addEventListener("click", () => {
  if (newCustomerButton.textContent.trim() === "Agregar") {
    //preparar pantalla para ingreso de datos
    fields.forEach((field) => {
      field.removeAttribute("readonly");
      field.value = ""; // Limpiar los valores predefinidos
    });

    newCustomerButton.textContent = "Aceptar";
    customerStateField.setAttribute("readonly", "");
    customerStateField.value = "ACTIVO";
    customerNamesField.focus();
  } else {
    //Agregar el cliente
    fields.forEach((field) => {
      field.setAttribute("readonly", "");
    });

    newCustomerButton.textContent = "Agregar";
  }
});
