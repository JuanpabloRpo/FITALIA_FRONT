document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.querySelector(".boton-guardar-centrado");

    btnGuardar.addEventListener("click", async () => {
        const tipo = document.querySelectorAll(".select-campo")[0].value;
        const duracionTexto = document.querySelectorAll(".select-campo")[1].value;
        const intensidad = document.querySelectorAll(".select-campo")[2].value;

        const duracion = parseInt(duracionTexto);

        const data = {
            userId: 1,
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
                <td>${item.cumplido ? "✔️ Cumplido" : "⏳ Pendiente"}</td>
                <td>
                    <button onclick="marcarCumplido(${item.id})">✔</button>
                    <button onclick="editarHabito(${item.id}, '${item.tipo}', ${item.duracionMin}, '${item.intensidad}')">✏</button>
                    <button onclick="eliminarHabito(${item.id})">🗑</button>
                </td>
            </tr>
        `;
    });
}

async function marcarCumplido(id) {
    await fetch(`https://localhost:7064/api/SaludFisica/Cumplido/${id}`, {
        method: "PUT"
    });
    cargarHistorial();
}

async function eliminarHabito(id) {
    if (!confirm("¿Seguro que deseas eliminar este hábito?")) return;

    await fetch(`https://localhost:7064/api/SaludFisica/Eliminar/${id}`, {
        method: "DELETE"
    });

    cargarHistorial();
}

async function editarHabito(id, tipoActual, duracionActual, intensidadActual) {
    const nuevoTipo = prompt("Nuevo tipo:", tipoActual);
    const nuevaDuracion = parseInt(prompt("Nueva duración (min):", duracionActual));
    const nuevaIntensidad = prompt("Nueva intensidad:", intensidadActual);

    const data = {
        id: id,
        userId: 1,
        tipo: nuevoTipo,
        duracionMin: nuevaDuracion,
        intensidad: nuevaIntensidad
    };

    await fetch(`https://localhost:7064/api/SaludFisica/Editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    cargarHistorial();
}


