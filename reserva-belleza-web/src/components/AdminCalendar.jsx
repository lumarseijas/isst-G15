import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservaEditarModal from "../pages/ReservaEditarModal";
import ReservaDetalleModal from "../pages/ReservaDetalleModal";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const intervalos = generarIntervalos();

const AdminCalendar = ({ trabajadores, reservas, servicios, semana, recargarReservas }) => {
  const diasConFecha = getDiasSemanaConFecha(semana.inicio);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [diasNoDisponibles, setDiasNoDisponibles] = useState([]);

  useEffect(() => {
    const cargarDiasLibres = async () => {
      try {
        const respuestas = await Promise.all(
          trabajadores.map((t) =>
            axios.get(`http://localhost:5000/api/dias-no-disponibles/${t.id}`)
          )
        );

        const todos = respuestas.flatMap((res, i) =>
          res.data.map((d) => ({
            trabajadorId: trabajadores[i].id,
            fecha: d.fecha,
          }))
        );

        setDiasNoDisponibles(todos);
      } catch (error) {
        console.error("Error al cargar días no disponibles", error);
      }
    };

    if (trabajadores.length > 0) {
      cargarDiasLibres();
    }
  }, [trabajadores]);

  const tieneDiaLibre = (trabajadorId, fechaISO) => {
    return diasNoDisponibles.some(
      (d) => d.trabajadorId === trabajadorId && d.fecha === fechaISO
    );
  };

  const handleClickReserva = (reserva) => {
    setReservaSeleccionada(reserva);
    setModoEdicion(false);
  };

  const cerrarModal = () => {
    setReservaSeleccionada(null);
    setModoEdicion(false);
  };

  const abrirEdicion = () => {
    setModoEdicion(true);
  };

  const cancelarReserva = async () => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/reservas/${reservaSeleccionada.id}`);
      alert("🗑️ Reserva cancelada correctamente");
      cerrarModal();
      recargarReservas();
    } catch (error) {
      console.error("❌ Error al cancelar la reserva:", error);
      alert("Error al cancelar la reserva");
    }
  };

  const guardarCambios = async (reservaActualizada) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservas/${reservaActualizada.id}`,
        reservaActualizada
      );
      alert("✅ Reserva actualizada correctamente");
      cerrarModal();
      recargarReservas();
    } catch (error) {
      console.error("❌ Error al actualizar la reserva:", error);
      alert("Error al actualizar la reserva");
    }
  };

  return (
    <>
      <table className="tabla-calendario">
        <thead>
          <tr>
            <th>Hora</th>
            {diasConFecha.map((dia) => (
              <th key={dia.texto} colSpan={trabajadores.length}>
                {dia.texto}
              </th>
            ))}
          </tr>
          <tr>
            <th></th>
            {diasConFecha.flatMap((dia) =>
              trabajadores.map((t) => (
                <th key={`${dia.texto}-${t.id}`}>{t.nombre}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {intervalos.map((intervalo, idx) => (
            <tr key={intervalo}>
              <td>{intervalo}</td>
              {diasConFecha.flatMap((dia) =>
                trabajadores.map((trabajador) => {
                  const reserva = reservas.find((r) => {
                    if (!r || !r.fechaYHora || !r.trabajador || !r.servicio) return false;
                    const fecha = new Date(r.fechaYHora);
                    return (
                      r.trabajador.id === trabajador.id &&
                      r.fechaYHora.startsWith(dia.fechaISO) &&
                      formatoHora(fecha) === intervalo
                    );
                  });

                  const reservaEnCurso = reservas.some((r) => {
                    if (!r || !r.fechaYHora || !r.trabajador || !r.servicio) return false;
                    const fecha = new Date(r.fechaYHora);
                    const bloques = Math.ceil(r.servicio.duracion / 15);
                    const startIdx = intervalos.findIndex((i) => formatoHora(fecha) === i);
                    return (
                      r.trabajador.id === trabajador.id &&
                      r.fechaYHora.startsWith(dia.fechaISO) &&
                      idx > startIdx &&
                      idx < startIdx + bloques
                    );
                  });

                  if (reservaEnCurso) return null;

                  if (reserva) {
                    const bloques = Math.ceil(reserva.servicio.duracion / 15);
                    const colorServicio =
                      servicios.find((s) => s.id === reserva.servicio.id)?.color || "#888";

                    return (
                      <td
                        key={`${dia.fechaISO}-${trabajador.id}-${intervalo}`}
                        rowSpan={bloques}
                      >
                        <div
                          className="bloque-reserva"
                          style={{ backgroundColor: colorServicio, cursor: "pointer" }}
                          onClick={() => handleClickReserva(reserva)}
                        >
                          {reserva.servicio.nombre}
                        </div>
                      </td>
                    );
                  }

                  if (tieneDiaLibre(trabajador.id, dia.fechaISO)) {
                    if (idx === 0) {
                      return (
                        <td
                          key={`${dia.fechaISO}-${trabajador.id}-${intervalo}`}
                          rowSpan={intervalos.length}
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "#555",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          
                        </td>
                      );
                    } else {
                      return null;
                    }
                  }

                  return (
                    <td key={`${dia.fechaISO}-${trabajador.id}-${intervalo}`}></td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modales */}
      {reservaSeleccionada && !modoEdicion && (
        <ReservaDetalleModal
          reserva={reservaSeleccionada}
          onClose={cerrarModal}
          onEditar={abrirEdicion}
          onCancelar={cancelarReserva}
        />
      )}

      {reservaSeleccionada && modoEdicion && (
        <ReservaEditarModal
          reserva={reservaSeleccionada}
          onClose={cerrarModal}
          onGuardar={guardarCambios}
        />
      )}
    </>
  );
};

// Funciones auxiliares
function getDiasSemanaConFecha(semanaInicio) {
  const dias = [];
  for (let i = 0; i < 5; i++) {
    const fecha = new Date(semanaInicio);
    fecha.setDate(fecha.getDate() + i);
    const diaTexto = diasSemana[i];
    const diaNumero = fecha.getDate();
    dias.push({
      texto: `${diaTexto} ${diaNumero}`,
      fechaISO: fecha.toISOString().split("T")[0],
    });
  }
  return dias;
}

function generarIntervalos() {
  const intervalos = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 21 && m > 0) break;
      intervalos.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  return intervalos;
}

function formatoHora(date) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default AdminCalendar;
