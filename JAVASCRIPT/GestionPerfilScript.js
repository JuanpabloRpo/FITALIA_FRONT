document.addEventListener("DOMContentLoaded", () => {
    
    // === 1. REFERENCIAS A ELEMENTOS DEL DOM ===
    // Vista Principal (Tarjeta)
    const nombreDisplay = document.getElementById("nombreDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const cumpleDisplay = document.getElementById("cumpleDisplay"); // Aquí mostraremos la edad
    const imgPerfilDisplay = document.getElementById("imgPerfilDisplay");
    
    // Modal y Botones
    const modal = document.getElementById("modalEdicion");
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const btnCerrarModal = document.getElementById("btnCerrarModal");
    const btnCancelar = document.getElementById("btnCancelar");
    const formEditar = document.getElementById("formEditarPerfil");
    
    // Inputs del Formulario
    const inputNombre = document.getElementById("inputNombre");
    const inputApellido = document.getElementById("inputApellido");
    const inputEmail = document.getElementById("inputEmail");
    const inputCumple = document.getElementById("inputCumple"); // Input de fecha
    const inputPassword = document.getElementById("inputPassword");
    const inputImagen = document.getElementById("inputImagen");
    const imgPreview = document.getElementById("imgPreview");

    // === 2. CARGAR DATOS DEL LOCALSTORAGE ===
    // Recuperamos el objeto tal cual lo mostraste en la consola
    let usuario = JSON.parse(localStorage.getItem("usuarioFitalia")) || {};
    
    // Función para pintar los datos en la pantalla
    function actualizarVista() {
        // Validamos que existan los datos para evitar errores
        if (usuario) {
            // Usamos 'nombre' y 'apellidoPaterno' según tu consola
            const nombreCompleto = `${usuario.nombre || 'Usuario'} ${usuario.apellidoPaterno || ''}`;
            nombreDisplay.textContent = nombreCompleto;
            
            // Usamos 'correo'
            emailDisplay.textContent = usuario.correo || 'Sin correo';
            
            // Tu backend trae 'edad' (ej: 27), no fecha. Mostramos la edad.
            // Nota: Si en el HTML dice "Cumpleaños", podrías cambiar el texto a "Edad" con JS o en el HTML.
            if (usuario.edad) {
                cumpleDisplay.textContent = `${usuario.edad} Años`;
                // Opcional: Cambiar la etiqueta visualmente si lo deseas
                const etiquetaEdad = cumpleDisplay.previousElementSibling; // El span que dice "CUMPLEAÑOS"
                if(etiquetaEdad) etiquetaEdad.textContent = "EDAD"; 
            } else {
                cumpleDisplay.textContent = "--";
            }
            
            // Foto de perfil (si agregaste una lógica para guardarla en el futuro)
            if(usuario.fotoPerfil){
                imgPerfilDisplay.src = usuario.fotoPerfil;
            }
        }
    }

    // Ejecutar carga inicial
    actualizarVista();

    // === 3. ABRIR MODAL Y RELLENAR FORMULARIO ===
    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            modal.classList.add("activo");
            
            // Rellenamos los inputs con las claves CORRECTAS de tu backend
            inputNombre.value = usuario.nombre || "";
            
            // Combinamos Paterno y Materno para el campo de apellidos, o solo Paterno
            const apellidos = `${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim();
            inputApellido.value = apellidos;
            
            inputEmail.value = usuario.correo || "";
            
            // OJO: Tu backend trae 'edad' (numero), pero el input es tipo 'date'.
            // No podemos convertir "27" a una fecha exacta automáticamente.
            // Dejaremos el input de fecha vacío para que el usuario lo seleccione si quiere actualizarlo,
            // o si tienes una fecha guardada localmente, úsala.
            inputCumple.value = ""; 
            
            inputPassword.value = ""; // Por seguridad, la contraseña suele dejarse vacía
            
            // Preview de imagen
            imgPreview.src = usuario.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        });
    }

    // === 4. CERRAR MODAL ===
    const cerrarModal = () => modal.classList.remove("activo");
    if (btnCerrarModal) btnCerrarModal.addEventListener("click", cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarModal);

    // === 5. PREVISUALIZACIÓN DE IMAGEN ===
    if (inputImagen) {
        inputImagen.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // === 6. GUARDAR CAMBIOS (ACTUALIZAR EL OBJETO) ===
    if (formEditar) {
        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();

            // Actualizamos el objeto 'usuario' manteniendo la estructura de tu backend
            usuario.nombre = inputNombre.value;
            
            // Lógica simple para apellidos: Todo lo que escriban lo ponemos en Paterno temporalmente
            // o podrías intentar separarlo por espacios.
            usuario.apellidoPaterno = inputApellido.value; 
            
            // usuario.correo = inputEmail.value; // Usualmente el correo es ID y no se edita, pero si quieres:
            // usuario.correo = inputEmail.value;

            // Si el usuario seleccionó una fecha, calculamos la edad (opcional)
            if (inputCumple.value) {
                const nacimiento = new Date(inputCumple.value);
                const hoy = new Date();
                let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
                usuario.edad = edadCalculada; 
            }

            // Guardar foto si cambió (Base64)
            if (imgPreview.src && !imgPreview.src.includes("flaticon")) {
                 usuario.fotoPerfil = imgPreview.src;
            }

            // 1. Guardamos en LocalStorage
            localStorage.setItem("usuarioFitalia", JSON.stringify(usuario));

            // 2. Actualizamos la vista
            actualizarVista();
            
            // 3. Cerramos modal
            cerrarModal();
            
            alert("Perfil actualizado correctamente");
            console.log("Usuario actualizado:", usuario);
        });
    }
});