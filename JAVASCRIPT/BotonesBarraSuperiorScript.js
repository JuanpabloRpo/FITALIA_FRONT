document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. BOTONES DE NAVEGACIÓN (BARRA SUPERIOR)
    // ==========================================
    
    const btnFisica = document.getElementById("btnSaludFisica");
    if (btnFisica) {
        btnFisica.addEventListener("click", () => {
            window.location.href = "SaludFisica.html";
        });
    }

    const btnMental = document.getElementById("btnSaludMental");
    if (btnMental) {
        btnMental.addEventListener("click", () => {
            window.location.href = "SaludMental.html";
        });
    }

    const btnNutri = document.getElementById("btnNutricional");
    if (btnNutri) {
        btnNutri.addEventListener("click", () => {
            window.location.href = "Nutricional.html";
        });
    }

    const btnHome = document.getElementById("btnHome");
    if (btnHome) {
        btnHome.addEventListener("click", () => {
            window.location.href = "PrincipalRegistrado.html";
        });
    }

    // ==========================================
    // 2. MENÚ HAMBURGUESA
    // ==========================================

    const menuIcon = document.getElementById("hamburgerMenu");
    const dropdown = document.getElementById("dropdownMenu");

    if (menuIcon && dropdown) {
        // Abrir/Cerrar menú al dar clic al icono
        menuIcon.addEventListener("click", () => {
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        });

        // Cerrar menú si se hace clic fuera de él
        document.addEventListener("click", (e) => {
            if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });
    }

    // ==========================================
    // 3. CERRAR SESIÓN
    // ==========================================

    const btnCerrarSesion = document.getElementById('cerrarSesion');

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", (e) => {
            // A. Evitamos la navegación automática del enlace <a>
            e.preventDefault();

            // B. Borramos los datos del usuario
            localStorage.removeItem("usuarioFitalia");
            
            // Opcional: localStorage.clear(); // Si quieres borrar todo

            console.log("Sesión cerrada, datos borrados.");

            // C. Redirigimos manualmente al Home
            window.location.href = "Home.html";
        });
    }

}); 