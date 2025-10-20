document.addEventListener("DOMContentLoaded", () => { 
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
});