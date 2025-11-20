// ---------------------------------------------------------------
// INICIALIZACIÓN
// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.querySelector(".boton-guardar-centrado");

    btnGuardar.addEventListener("click", async () => {
        const tipo = document.querySelectorAll(".select-campo")[0].value;
        const duracionTexto = document.querySelectorAll(".select-campo")[1].value;
        const intensidad = document.querySelectorAll(".select-campo")[2].value;

        const duracion = parseInt(duracionTexto);

        const userId = localStorage.getItem("userId");

        const data = {
            userId: parseInt(userId),
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


// ---------------------------------------------------------------
// CARGAR HISTORIAL
// ---------------------------------------------------------------
async function cargarHistorial() {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("No se encontró el usuario logueado.");
        return;
    }

    const res = await fetch(`https://localhost:7064/api/SaludFisica/Historial/${userId}`);

    if (!res.ok) {
        alert("Error al cargar historial");
        return;
    }

    const data = await res.json();

    const tbody = document.querySelector(".tabla-historial tbody");
    tbody.innerHTML = "";

    for (const item of data) {

        const recordatorio = await obtenerRecordatorio(item.id);

        const icono = recordatorio ? "⏰" : "➕";
        const tooltip = recordatorio ? "Editar recordatorio" : "Agregar recordatorio";

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

                <td>
                    <span class="btn-recordatorio"
                        title="${tooltip}"
                        onclick="gestionarRecordatorio(${item.id})"
                        style="cursor:pointer;font-size:30px;">
                        ${icono}
                    </span>
                </td>
            </tr>
        `;
    }
}



// ---------------------------------------------------------------
// RECORDATORIOS
// ---------------------------------------------------------------

let habitoSeleccionado = null;
let recordatorioExistente = null;

// CONSULTAR RECORDATORIO POR HÁBITO
async function obtenerRecordatorio(saludFisicaId) {
    const res = await fetch(`https://localhost:7064/api/Recordatorios/PorHabito/${saludFisicaId}`);

    if (!res.ok) return null;

    const lista = await res.json();

    // devuelve el objeto o null
    return lista.length > 0 ? lista[0] : null;
}



// ABRIR MODAL Y CARGAR DATOS
async function gestionarRecordatorio(saludFisicaId) {
    habitoSeleccionado = saludFisicaId;

    await cargarRecordatorioEnModal(saludFisicaId);

    document.getElementById("modalRecordatorio").style.display = "flex";
}


// CERRAR MODAL
function cerrarModal() {
    document.getElementById("modalRecordatorio").style.display = "none";
}


// CARGAR DATOS EXISTENTES EN EL MODAL
async function cargarRecordatorioEnModal(saludFisicaId) {
    const res = await fetch(`https://localhost:7064/api/Recordatorios/PorHabito/${saludFisicaId}`);

    if (res.ok) {
        const lista = await res.json();

if (lista.length > 0) {
    recordatorioExistente = lista[0];

    let [fechaISO, horaISO] = recordatorioExistente.fecha.split("T");

            document.getElementById("recMensaje").value = recordatorioExistente.mensaje || "";
            document.getElementById("recFecha").value = fechaISO;
            document.getElementById("recHora").value = horaISO.substring(0, 5);
        } 
        else {
            limpiarModal();
        }
    } else {
        limpiarModal();
    }
}

function limpiarModal() {
    recordatorioExistente = null;
    document.getElementById("recMensaje").value = "";
    document.getElementById("recFecha").value = "";
    document.getElementById("recHora").value = "";
}




// GUARDAR CAMBIOS DESDE EL MODAL
document.getElementById("btnGuardarRecordatorio").addEventListener("click", async () => {

    const mensaje = document.getElementById("recMensaje").value;
    const fecha = document.getElementById("recFecha").value;
    const hora = document.getElementById("recHora").value;

    if (!fecha || !hora) {
        alert("Selecciona fecha y hora.");
        return;
    }

    const fechaCompleta = `${fecha}T${hora}:00`;

    const body = {
        mensaje: mensaje,
        fecha: fechaCompleta,
        activo: true,
        posponerse: false,
        saludFisicaId: habitoSeleccionado
    };

    if (recordatorioExistente) {
        // EDITAR
        await fetch(`https://localhost:7064/api/Recordatorios/Editar/${recordatorioExistente.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        alert("Recordatorio actualizado.");

    } else {
        // CREAR
        await fetch("https://localhost:7064/api/Recordatorios/Crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        alert("Recordatorio creado.");
    }

    cerrarModal();
    cargarHistorial();
});


// ---------------------------------------------------------------
// FUNCIONES PARA HÁBITOS
// ---------------------------------------------------------------

async function marcarCumplido(id) {
    await fetch(`https://localhost:7064/api/SaludFisica/Cumplido/${id}`, { method: "PUT" });
    cargarHistorial();
}

async function eliminarHabito(id) {
    if (!confirm("¿Seguro que deseas eliminar este hábito?")) return;
    await fetch(`https://localhost:7064/api/SaludFisica/Eliminar/${id}`, { method: "DELETE" });
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
