document.addEventListener("DOMContentLoaded", () => {

    // === PASO 1: SEGURIDAD Y CARGA DE DATOS ===
    const usuarioGuardado = localStorage.getItem("usuarioFitalia");
    const API_BASE_URL = `https://localhost:7064/api/EstadoDeAnimo`;

    if (!usuarioGuardado) {
        alert("Debes iniciar sesión primero");
        window.location.href = "IniciarSesion.html";
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    const userId = usuario.userId;
    const hoy = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    // === REFERENCIAS DEL MODAL ===
    const botones = document.querySelectorAll(".nivel");
    const overlay = document.querySelector(".overlay");
    
    if (!botones || !overlay) return;

    // ==========================================================
    // LÓGICA DE ENVÍO DE ESTADO DE ÁNIMO (POST)
    // ==========================================================
    async function guardarEstadoAnimo(userId, tipoAnimo) {
        const fechaISO = new Date().toISOString(); 
        const API_URL_SELECCIONAR = `${API_BASE_URL}/SeleccionarEstado`;

        const payload = {
            userId: userId,
            tipoDeAnimo: tipoAnimo,
            Fecha: fechaISO
        };
        
        console.log("Enviando estado de ánimo:", payload);

        try {
            const response = await fetch(API_URL_SELECCIONAR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log(`Estado de ánimo ${tipoAnimo} guardado con éxito.`);
                
                // Si se guarda en BD, guardamos la fecha en local para evitar futuras consultas HOY
                localStorage.setItem("estadoAnimoFecha", hoy);
                localStorage.setItem("estadoAnimoValor", tipoAnimo);
                
                return true;
            } else {
                const errorText = await response.text();
                console.error(`Error al guardar estado de ánimo: ${response.status}`, errorText);
                alert("Error al guardar el estado de ánimo. El servidor respondió con un error.");
                return false;
            }
        } catch (error) {
            console.error("Error de conexión al guardar estado:", error);
            alert("Problema de conexión con el servidor. Verifica que la API esté activa.");
            return false;
        }
    }


    // ==========================================================
    // LÓGICA DE VERIFICACIÓN DE ESTADO DE ÁNIMO (GET CON TIMEOUT)
    // ==========================================================
    async function verificarEstadoAnimo() {
        const userId = usuario.userId;
        const hoy = new Date().toISOString().split("T")[0]; 
        const API_BASE_URL = `https://localhost:7064/api/EstadoDeAnimo`;

        // URL del endpoint de consulta (ObtenerEstado)
        const API_URL_OBTENER = `${API_BASE_URL}/ObtenerEstado?userId=${userId}&fecha=${hoy}`;
        
        // Timeout de 5 segundos para que no se cuelgue
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        try {
            // Hacemos la consulta forzada a la BD
            const response = await fetch(API_URL_OBTENER, { signal: controller.signal });
            clearTimeout(timeoutId); 

            if (response.ok) {
                // Status 200 OK: Ya existe un registro para hoy. Ocultamos el modal.
                overlay.style.display = "none";
                console.log("Estado de ánimo: Ya registrado hoy (DB).");
                
                // Si la BD lo confirma, actualizamos el localStorage para que el check sea rápido después
                localStorage.setItem("estadoAnimoFecha", hoy); 
                return;
                
            } else if (response.status === 404) {
                // Status 404 Not Found: No hay registro. Mostrar modal para preguntar.
                overlay.style.display = "flex";
                return;
                
            } else {
                // Otro error (400, 500, etc.). Fallback: Mostrar modal.
                console.error(`Error al consultar estado de ánimo: ${response.status}`);
                overlay.style.display = "flex"; // Asumimos que no pudo preguntar y damos la opción manual
            }

        } catch (error) {
            clearTimeout(timeoutId);
            // Si el error es por timeout, aún mostramos el modal, ya que no obtuvimos una respuesta 200.
            if (error.name === 'AbortError') {
                console.warn("Consulta de estado de ánimo fallida por timeout (5s). Mostrando modal.");
            } else {
                console.error("Error de conexión con la API:", error);
            }
            overlay.style.display = "flex"; // Fallback final
        }
    }

    // --- MANEJO DE BOTONES DEL MODAL ---
    botones.forEach(boton => {
        boton.addEventListener("click", async () => { 
            // El valor de tipoDeAnimo debe ser INT (1 a 5) según tu tabla TypeAnimo
            const moodValue = parseInt(boton.textContent, 10);
            
            // 1. Intentar guardar en la BD
            const saved = await guardarEstadoAnimo(userId, moodValue);

            if (saved) {
                // 2. Si se guardó en BD, ocultar modal
                overlay.style.display = "none";
            }
            // Si falló, la función guardarEstadoAnimo ya mostró una alerta.
        });
    });

    // === INICIO DE LA LÓGICA ===
    verificarEstadoAnimo();
});