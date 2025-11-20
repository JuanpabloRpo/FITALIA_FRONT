document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONFIGURACIÓN Y REFERENCIAS ---
    
    // !!! REEMPLAZA ESTA URL CON TU ENDPOINT REAL DE LA API !!!
    const API_URL_BASE_CONTENIDO = `https://localhost:7064/api/DistribucionContenido/ObtenerContenido`;
    
    const contenidoContainer = document.getElementById("contenedorContenido"); 
    
    // Salir si el contenedor principal no existe para evitar errores
    if (!contenidoContainer) return;

    // Obtener el ID de Ánimo del localStorage, usando 3 como neutro por defecto
    const animoIdString = localStorage.getItem("estadoAnimoValor");
    let animoId = 3; 

    if (animoIdString) {
        const parsedId = parseInt(animoIdString, 10);
        // Validar que el ID esté en el rango esperado (1 a 5)
        if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 5) {
            animoId = parsedId;
        }
    }

    // --- 2. FUNCIÓN DE CONSTRUCCIÓN DE TARJETAS ---
    
    /**
     * Crea un elemento de tarjeta HTML para un video o una imagen.
     * @param {Object} item - Objeto de contenido de la API con urlContenido, titulo, descripcion.
     * @param {string} tipo - "imagen" o "video".
     * @returns {HTMLElement | null} La tarjeta creada o null si no hay URL válida.
     */
    function crearTarjetaContenido(item, tipo) {
        const url = item.urlContenido;
        // La validación clave para prevenir errores 404
        if (!url) {
            console.warn(`Item de contenido tipo ${tipo} sin URL válido:`, item);
            return null; 
        }

        let rutaFinal;
        
        // Determinar si la URL es externa (http/https) o interna (ruta relativa)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            rutaFinal = url; // Es URL completa (ej: Pexels)
        } else {
            rutaFinal = `/ASSERTS/Contenido/${url}`; // Es ruta local
        }
        
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        // Usar los datos de la API o valores por defecto
        const titulo = item.titulo || (tipo === "video" ? "Rutina de Bienestar" : "Tip del Día");
        const descripcion = item.descripcion || `Contenido de ${tipo} recomendado para ti.`;

        // Generar el HTML para el medio (img o video)
        const mediaHTML = tipo === "video"
            ? `<video controls src="${rutaFinal}"></video>`
            : `<img src="${rutaFinal}" alt="${titulo}">`;

        // Estructura final de la tarjeta
        tarjeta.innerHTML = `
            <div class="media-container">${mediaHTML}</div>
            <div class="tarjeta-info">
                <span class="tipo">${tipo === "video" ? "Video" : "Infografía"}</span>
                <h3>${titulo}</h3>
                <p>${descripcion}</p>
            </div>
        `;

        return tarjeta;
    }

    // --- 3. FUNCIÓN PRINCIPAL DE CARGA ---
    
    async function cargarContenido() {
        // Muestra mensaje de carga antes de la llamada a la API
        contenidoContainer.innerHTML = `<p style="text-align: center;">Cargando contenido personalizado...</p>`; 

        try {
            // Realizar la petición fetch a la API con el animoId
            const response = await fetch(`${API_URL_BASE_CONTENIDO}?animoId=${animoId}`);

            if (!response.ok) {
                // Lanza un error si la respuesta HTTP no es exitosa (ej: 404, 500)
                throw new Error(`Error ${response.status}: La API no respondió correctamente.`);
            }

            const contenido = await response.json();
            
            console.log("Respuesta API recibida:", contenido);

            // Verificar si hay contenido válido
            const tieneImagenes = contenido.imagenes && Array.isArray(contenido.imagenes) && contenido.imagenes.length > 0;
            const tieneVideos = contenido.videos && Array.isArray(contenido.videos) && contenido.videos.length > 0;

            if (!tieneImagenes && !tieneVideos) {
                contenidoContainer.innerHTML = `<p style="text-align: center;">No hay contenido disponible para tu estado de ánimo.</p>`;
                return;
            }

            // Limpiar el mensaje de carga antes de insertar los elementos
            contenidoContainer.innerHTML = ""; 

            // --- Procesar IMÁGENES ---
            if (tieneImagenes) {
                contenido.imagenes.forEach(item => {
                    const tarjeta = crearTarjetaContenido(item, "imagen");
                    if (tarjeta) contenidoContainer.appendChild(tarjeta);
                });
            }

            // --- Procesar VIDEOS ---
            if (tieneVideos) {
                contenido.videos.forEach(item => {
                    const tarjeta = crearTarjetaContenido(item, "video");
                    if (tarjeta) contenidoContainer.appendChild(tarjeta);
                });
            }

        } catch (error) {
            console.error("Error crítico al cargar o procesar la API:", error);
            // Mostrar un mensaje de error amigable al usuario
            contenidoContainer.innerHTML = `<p style="text-align: center; color: #d81b60;">Error al cargar el contenido. Por favor, revisa la consola para más detalles.</p>`;
        }
    }

    // --- 4. INICIAR LA CARGA ---
    cargarContenido();
});