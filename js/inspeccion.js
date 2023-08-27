/* Mostrar y ocultar las descripciones en la barra lateral */
document.addEventListener("DOMContentLoaded", function () {
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
});
