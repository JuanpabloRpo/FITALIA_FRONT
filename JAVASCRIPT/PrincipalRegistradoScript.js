document.addEventListener("DOMContentLoaded", () => {

    const usuarioGuardado = localStorage.getItem("usuarioFitalia");

    // PASO 3: Verificar seguridad (Si no hay usuario, lo mandamos al login)
    if (!usuarioGuardado) {
        alert("Debes iniciar sesión primero");
        window.location.href = "IniciarSesion.html";
        return; // Detenemos la ejecución
    }

    // Convertimos el texto de vuelta a Objeto JavaScript
    const usuario = JSON.parse(usuarioGuardado);

    // AHORA PUEDES USAR LOS DATOS
    console.log("Usuario actual:", usuario);
    
    // Ejemplo: Poner el nombre en algún lugar (si tu HTML tuviera un id="nombreUsuario")
    // document.getElementById("nombreUsuario").innerText = usuario.nombre; 

    // Lógica para el estado de ánimo...

    const botones = document.querySelectorAll(".nivel");
    const overlay = document.querySelector(".overlay");

    // Si no existen los elementos, no hace nada
    if (!botones || !overlay) return;

    // ---  VALIDAR SI HOY YA FUE MOSTRADO ---
    const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const ultimaVez = localStorage.getItem("estadoAnimoFecha");
    
    

    // Si ya se pregunto HOY → NO mostrar
    if (ultimaVez === hoy) {
        overlay.style.display = "none";
        return;
    }

    // Si no, mostrar el overlay al entrar a la página
    overlay.style.display = "flex";

    
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            overlay.style.display = "none";

            // Guardar que hoy ya contestó
            localStorage.setItem("estadoAnimoFecha", hoy);

            // (Opcional) Guardar nivel seleccionado
            localStorage.setItem("estadoAnimoValor", boton.textContent);
            
        });
    });
    
});
