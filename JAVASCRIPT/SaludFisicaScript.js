document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.querySelector(".boton-guardar-centrado");

    btnGuardar.addEventListener("click", async () => {
        const tipo = document.querySelectorAll(".select-campo")[0].value;
        const duracionTexto = document.querySelectorAll(".select-campo")[1].value;
        const intensidad = document.querySelectorAll(".select-campo")[2].value;

        // Extraer solo el número (ej: "30 min" → 30)
        const duracion = parseInt(duracionTexto);

        const data = {
            userId: 1, // Lo harás dinámico cuando tengas login
            tipo: tipo,
            duracionMin: duracion,
            intensidad: intensidad
        };

        const res = await fetch("https://localhost:7064/api/SaludFisica/Registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Actividad guardada");
            cargarHistorial();
        } else {
            alert("Error al guardar actividad");
        }
    });

    cargarHistorial();
});

async function cargarHistorial() {
    const res = await fetch("https://localhost:7064/api/SaludFisica/Historial/1");
    const data = await res.json();

    const tbody = document.querySelector(".tabla-historial tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.fecha.substring(0,10)}</td>
                <td>${item.tipo}</td>
                <td>${item.duracionMin} min</td>
                <td>${item.intensidad}</td>
            </tr>
        `;
    });
}


