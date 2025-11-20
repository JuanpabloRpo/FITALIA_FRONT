document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "https://localhost:7064/api/GestionarPerfil";

    // === 1. REFERENCIAS ===
    const nombreDisplay = document.getElementById("nombreDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const cumpleDisplay = document.getElementById("cumpleDisplay");
    const imgPerfilDisplay = document.getElementById("imgPerfilDisplay");

    const modal = document.getElementById("modalEdicion");
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const btnCancelar = document.getElementById("btnCancelar");
    const formEditar = document.getElementById("formEditarPerfil");

    const inputNombre = document.getElementById("inputNombre");
    const inputApellido = document.getElementById("inputApellido");
    const inputEmail = document.getElementById("inputEmail");
    const inputCumple = document.getElementById("inputCumple");
    const inputPassword = document.getElementById("inputPassword");
    const inputImagen = document.getElementById("inputImagen");
    const imgPreview = document.getElementById("imgPreview");

    // === UTILIDAD: CALCULAR EDAD ===
    function calcularEdadDesdeFecha(fechaString) {
        if (!fechaString || fechaString.length < 10) return null;
        const hoy = new Date();
        const cumple = new Date(fechaString);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    }

    // === 2. CARGAR DATOS ===
    // Cargamos el objeto completo que incluye la fotoPerfil, nombre, fechaNacimiento, etc.
    let usuario = JSON.parse(localStorage.getItem("usuarioFitalia")) || {};

    function actualizarVista() {
        if (!usuario || !nombreDisplay) return; // Validación extra

        nombreDisplay.textContent = `${usuario.nombre || "Usuario"} ${usuario.apellidoPaterno || ""}`;
        emailDisplay.textContent = usuario.correo || "--";

        const edadCalculada = calcularEdadDesdeFecha(usuario.fechaNacimiento);
        
        if (edadCalculada !== null) {
            cumpleDisplay.textContent = `${edadCalculada} Años`;
            const etiquetaEdad = cumpleDisplay.previousElementSibling;
            if (etiquetaEdad) etiquetaEdad.textContent = "EDAD";
        } else if (usuario.fechaNacimiento && !isNaN(usuario.fechaNacimiento)) {
            // Caso borde por si el backend sigue enviando la edad como número
            cumpleDisplay.textContent = `${usuario.fechaNacimiento} Años`;
        } else {
            cumpleDisplay.textContent = "--";
        }

        imgPerfilDisplay.src = usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    actualizarVista();

    // === 3. ABRIR MODAL ===
    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            modal.classList.add("activo");
            inputNombre.value = usuario.nombre || "";
            inputApellido.value = `${usuario.apellidoPaterno || ""} ${usuario.apellidoMaterno || ""}`.trim();
            inputEmail.value = usuario.correo || "";
            
            // Carga la fecha en formato YYYY-MM-DD para el input type="date"
            inputCumple.value = usuario.fechaNacimiento || "";
            
            inputPassword.value = "";
            imgPreview.src = usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        });
    }

    const cerrarModal = () => modal.classList.remove("activo");
    if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModal);
    if (btnCancelar) btnCerrarModal.addEventListener("click", cerrarModal);

    // === 4. PREVIEW IMAGEN ===
    if (inputImagen) {
        inputImagen.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => imgPreview.src = e.target.result;
            reader.readAsDataURL(file);
        });
    }

    // === 5. FUNCIÓN DE PETICIÓN API (MANEJA LA FOTO EN EL BODY) ===
    async function actualizarAPI(endpoint, data) {
        try {
            const propiedadClave = variableEndPoint(endpoint); 
            
            // Si devolvió null (endpoint no existe), salimos
            if(!propiedadClave) return false;

            const { userId, [propiedadClave]: valorClave } = data;

            let nombreParametroApi = propiedadClave;

            // Mapeo especial para fecha (fechaNacimiento -> fechaNueva)
            if (endpoint === "CambiarFechaNacimiento") {
                nombreParametroApi = "fechaNueva"; 
            }

            const params = new URLSearchParams();
            params.append("userId", userId);

            // CRÍTICO: SOLO metemos el valor en la URL si NO es la foto
            if (endpoint !== "CambiarFotoPerfil") {
                 params.append(nombreParametroApi, valorClave);
            }

            // Enviamos la petición (la foto va en el body)
            const response = await fetch(`${API_URL}/${endpoint}?${params}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data) 
            });
            
            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }
            
            return true;
            
        } catch (error) {
            console.error("Error en actualizarAPI:", error);
            // Mostrar un mensaje de error más claro al usuario
            alert("Error al actualizar: Verifique su conexión y los datos.");
            return false;
        }
    }

    // === FUNCIÓN MAPPING DE ENDPOINTS (SWITCH) ===
    function variableEndPoint(endpoint) {
        switch (endpoint) {
            case "CambiarNombre": return "nombre"; 
            case "CambiarApellidoPaterno": return "apellidoPaterno";
            case "CambiarApellidoMaterno": return "apellidoMaterno";
            case "CambiarCorreo": return "correo";
            case "CambiarFechaNacimiento": return "fechaNacimiento"; 
            case "CambiarContrasena": return "contrasena";
            case "CambiarFotoPerfil": return "fotoPerfil";
            default:
                console.error(`El endpoint '${endpoint}' no está definido.`);
                return null;
        }
    }

    // === 6. GUARDAR CAMBIOS (SUBMIT) ===
    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userId = usuario.userId;
            let cambiosRealizados = false; // Flag para saber si hubo alguna actualización

            // --- NOMBRE ---
            if (inputNombre.value !== usuario.nombre) {
                if (await actualizarAPI("CambiarNombre", { userId, nombre: inputNombre.value })) {
                    usuario.nombre = inputNombre.value;
                    cambiosRealizados = true;
                }
            }

            // --- APELLIDOS ---
            let [paterno, materno] = inputApellido.value.split(" ");
            paterno = paterno || ""; materno = materno || "";
            
            if (paterno !== usuario.apellidoPaterno) {
                if (await actualizarAPI("CambiarApellidoPaterno", { userId, apellidoPaterno: paterno })) {
                    usuario.apellidoPaterno = paterno;
                    cambiosRealizados = true;
                }
            }
            if (materno !== usuario.apellidoMaterno) {
                if (await actualizarAPI("CambiarApellidoMaterno", { userId, apellidoMaterno: materno })) {
                    usuario.apellidoMaterno = materno;
                    cambiosRealizados = true;
                }
            }

            // --- CORREO ---
            if (inputEmail.value !== usuario.correo) {
                if (await actualizarAPI("CambiarCorreo", { userId, correo: inputEmail.value })) {
                    usuario.correo = inputEmail.value;
                    cambiosRealizados = true;
                }
            }

            // --- FECHA DE NACIMIENTO (STRING) ---
            if (inputCumple.value && inputCumple.value !== usuario.fechaNacimiento) {
                if (await actualizarAPI("CambiarFechaNacimiento", { userId, fechaNacimiento: inputCumple.value })) {
                    // GUARDAMOS EL STRING DE FECHA PARA FUTURAS CARGAS
                    usuario.fechaNacimiento = inputCumple.value;
                    cambiosRealizados = true;
                }
            }
            
            // --- CONTRASEÑA ---
            if (inputPassword.value.trim().length > 0) {
                // No se guarda la contraseña localmente por seguridad, solo se envia
                await actualizarAPI("CambiarContrasena", { userId, contrasena: inputPassword.value });
                cambiosRealizados = true;
            }

            // --- FOTO DE PERFIL (Base64) ---
            if (imgPreview.src && !imgPreview.src.includes("flaticon") && imgPreview.src !== usuario.fotoPerfil) {
                if (await actualizarAPI("CambiarFotoPerfil", { userId, fotoPerfil: imgPreview.src })) {
                    usuario.fotoPerfil = imgPreview.src;
                    cambiosRealizados = true;
                }
            }

            // --- FINALIZAR ---
            if (cambiosRealizados) {
                localStorage.setItem("usuarioFitalia", JSON.stringify(usuario));
                actualizarVista();
                alert("Perfil actualizado correctamente");
            } else {
                alert("No se detectaron cambios para guardar.");
            }
            
            cerrarModal(); // Cerramos el modal siempre al final
        });
    }
});