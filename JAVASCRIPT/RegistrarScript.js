document.addEventListener("DOMContentLoaded", () => { 
  document.getElementById("btnIniciar-Registrar").addEventListener("click", () => {
    window.location.href = "IniciarSesion.html";
  });

  document.getElementById("btnHome-Registrar").addEventListener("click", () => {
    window.location.href = "Home.html";
  });

  const btnRegistrar = document.getElementById("btnCrearCuenta-Registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Obtener valores de los inputs
    const nombre = document.getElementById("InputNombre").value.trim();
    const apellidos = document.getElementById("InputApellidos").value.trim();
    const correo = document.getElementById("InputCorreo").value.trim();
    const fechaStr = document.getElementById("InputCumpleaños").value.trim();
    const password = document.getElementById("InputPassword").value.trim();
    const apellidosSeparados = apellidos.split(" ");
    // Validar campos mínimos
    if (!nombre || !correo || !password) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    if (!fechaStr) {
      alert("Por favor ingresa tu fecha de nacimiento.");
      return;
    }

    const fechaNacimiento = new Date(fechaStr);
    const hoy = new Date();

    let edadF = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edadF--;
    }
    
    // Construir el objeto que enviará al backend
    const usuario = {
      nombre: nombre,
      apellidoPaterno: apellidosSeparados[0],
      apellidoMaterno: apellidosSeparados[1],
      edad: edadF,
      correo: correo,
      contraseña: password,
    };

    try {
      const response = await fetch("http://localhost:5283/API/Registrar/RegistrarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Usuario registrado correctamente ✅");
        console.log("Respuesta de la API:", data);
        window.location.href = "PrincipalRegistrado.html";
      } else {
        alert("❌ Error al registrar el usuario");
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  });
});