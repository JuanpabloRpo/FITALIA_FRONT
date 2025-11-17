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
    let usuario = JSON.parse(localStorage.getItem("usuarioFitalia")) || {};

    function actualizarVista() {
        if (!usuario) return;

        nombreDisplay.textContent = `${usuario.nombre || "Usuario"} ${usuario.apellidoPaterno || ""}`;
        emailDisplay.textContent = usuario.correo || "--";

        const edadCalculada = calcularEdadDesdeFecha(usuario.fechaNacimiento);
        
        if (edadCalculada !== null) {
            cumpleDisplay.textContent = `${edadCalculada} Años`;
            const etiquetaEdad = cumpleDisplay.previousElementSibling;
            if (etiquetaEdad) etiquetaEdad.textContent = "EDAD";
        } else if (usuario.fechaNacimiento && !isNaN(usuario.fechaNacimiento)) {
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
            
            inputCumple.value = (usuario.fechaNacimiento && usuario.fechaNacimiento.includes("-")) ? usuario.fechaNacimiento : "";
            
            inputPassword.value = "";
            imgPreview.src = usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        });
    }

    const cerrarModal = () => modal.classList.remove("activo");
    if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarModal);

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

    // === 5. FUNCIÓN DE PETICIÓN API ===
    async function actualizarAPI(endpoint, data) {
        try {
            const propiedadClave = variableEndPoint(endpoint); 
            
            const { userId, [propiedadClave]: valorClave } = data;

            let nombreParametroApi = propiedadClave;

            if (endpoint === "CambiarFechaNacimiento") {
                nombreParametroApi = "fechaNueva"; 
            }

            const params = new URLSearchParams({
                userId: userId,
                [nombreParametroApi]: valorClave 
            });
            
            const response = await fetch(`${API_URL}/${endpoint}?${params}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            return true;
            
        } catch (error) {
            console.error("Error en actualizarAPI:", error);
            return false;
        }
    }

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

    // === 6. GUARDAR CAMBIOS ===
    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userId = usuario.userId;


            if (inputNombre.value !== usuario.nombre) {
                await actualizarAPI("CambiarNombre", { userId, nombre: inputNombre.value });
                usuario.nombre = inputNombre.value;
            }


            let [paterno, materno] = inputApellido.value.split(" ");
            paterno = paterno || ""; materno = materno || "";
            if (paterno !== usuario.apellidoPaterno) {
                await actualizarAPI("CambiarApellidoPaterno", { userId, apellidoPaterno: paterno });
                usuario.apellidoPaterno = paterno;
            }
            if (materno !== usuario.apellidoMaterno) {
                await actualizarAPI("CambiarApellidoMaterno", { userId, apellidoMaterno: materno });
                usuario.apellidoMaterno = materno;
            }

            // ... (Lógica correo igual) ...
            if (inputEmail.value !== usuario.correo) {
                await actualizarAPI("CambiarCorreo", { userId, correo: inputEmail.value });
                usuario.correo = inputEmail.value;
            }


            if (inputCumple.value && inputCumple.value !== usuario.fechaNacimiento) {
                await actualizarAPI("CambiarFechaNacimiento", {
                    userId,
                    fechaNacimiento: inputCumple.value
                });
                usuario.fechaNacimiento = inputCumple.value;
            }


            if (inputPassword.value.trim().length > 0) {
                await actualizarAPI("CambiarContrasena", { userId, contrasena: inputPassword.value });
            }


            if (imgPreview.src && !imgPreview.src.includes("flaticon") && imgPreview.src !== usuario.fotoPerfil) {
                await actualizarAPI("CambiarFotoPerfil", { userId, fotoPerfil: imgPreview.src });
                usuario.fotoPerfil = imgPreview.src;
            }


            localStorage.setItem("usuarioFitalia", JSON.stringify(usuario));
            actualizarVista();
            cerrarModal();
            alert("Perfil actualizado correctamente");
        });
    }
});