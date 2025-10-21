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
    const url = `http://localhost:5283/API/IniciarSesion/VerificarUsuario?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET", // o "POST" si tu API lo requiere
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        window.location.href = "/HTML/PrincipalRegistrado.html";
      }else if(response.status = 404){
        alert("Usuario o contraseña no existe");
      }else{
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

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
