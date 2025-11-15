document.addEventListener("DOMContentLoaded", () => { 

  // ===== BOTONES DE LA BARRA SUPERIOR =====
  document.getElementById("btnSaludFisica").addEventListener("click", () => {
    window.location.href = "SaludFisica.html";
  });  

  document.getElementById("btnSaludMental").addEventListener("click", () => {
    window.location.href = "SaludMental.html";
  });

  document.getElementById("btnNutricional").addEventListener("click", () => {
    window.location.href = "Nutricional.html";
  });

  document.getElementById("btnHome").addEventListener("click", () => {
    window.location.href = "PrincipalRegistrado.html";
  });


  // ===== MENÚ HAMBURGUESA =====
  const menuIcon = document.getElementById("hamburgerMenu");
  const dropdown = document.getElementById("dropdownMenu");

  menuIcon.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
  });

  // Cerrar menú si clickea por fuera
  document.addEventListener("click", (e) => {
    if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});
