document.addEventListener("DOMContentLoaded", () => {
  
  const btnIniciar = document.getElementById("btnIniciar-IniciarSesion");

  btnIniciar.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña.");
      return;
    }

    const queryParams = new URLSearchParams({
      userName: email,
      password: password
    });

    const baseUrl = "https://localhost:7064"; 
    const url = `${baseUrl}/API/IniciarSesion/VerificarUsuario?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET", 
        headers: {
          "Accept": "application/json"
        }
      });

      // ----------------------------------------------------
      // 1. MANEJO DE ERRORES CLAVE
      // ----------------------------------------------------

      // CORRECCIÓN CRÍTICA: response.status === 404 (Comparación, no asignación)
      if (response.status === 404) { 
        alert("Usuario o contraseña no existe");
        return;
      }

      // Otros errores de servidor (500, 401, etc.)
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      // ----------------------------------------------------
      // 2. MANEJO DE RESPUESTA OK (200)
      // ----------------------------------------------------
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      if (data && data.userId) {
        
        // 🔥 SIMPLIFICACIÓN: Guardamos el objeto completo (con la foto)
        localStorage.setItem("usuarioFitalia", JSON.stringify(data));
        
        // REDIRECCIONAMOS
        window.location.href = "/HTML/PrincipalRegistrado.html";
      } else {
        alert("Error: La respuesta del servidor es incompleta.");
      }

    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  });

  document.getElementById("btnHome-IniciarSesion").addEventListener("click", () => {
    window.location.href = "Home.html";
  });

  document.getElementById("btnRegistrar-IniciarSesion").addEventListener("click", () => {
    window.location.href = "Registrar.html";
  });
});