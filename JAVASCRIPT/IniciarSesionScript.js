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

    // Construir la URL final
    // Esta URL ya nunca cambiará, sin importar en qué PC ejecutes el backend
    const baseUrl = "https://localhost:7064"; 

    const url = `${baseUrl}/API/IniciarSesion/VerificarUsuario?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET", // o "POST" si tu API lo requiere
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        if (data){
          // 🔥 GUARDAMOS LOS DATOS IMPORTANTES
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userName", data.nombreUsuario);
          localStorage.setItem("correo", data.correo);

          // (Opcional) Guardar todo el usuario
          localStorage.setItem("usuarioFitalia", JSON.stringify(data));

          // 🔥 REDIRECCIONAMOS
          window.location.href = "/HTML/PrincipalRegistrado.html";
        }else{
          alert("No se pudo traer los datos del usuario")
        }

      }else if(response.status = 404){
        alert("Usuario o contraseña no existe");
      }else{
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      

      // Aquí puedes manejar la respuesta según lo que devuelva tu API
    //   if (data.token) {
    //     localStorage.setItem("token", data.token);
        
    //   } else {
    //     alert("Credenciales incorrectas o usuario no encontrado");
    //   }

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
