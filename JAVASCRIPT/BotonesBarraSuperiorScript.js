document.addEventListener("DOMContentLoaded", () => { 


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
