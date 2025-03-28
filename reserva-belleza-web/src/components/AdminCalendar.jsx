import React, { useEffect, useState } from "react";
import axios from "axios";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const intervalos = generarIntervalos();

const AdminCalendar = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [semana, setSemana] = useState(getSemanaConOffset(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trabajadoresRes = await axios.get("http://localhost:5000/api/trabajadores");
        const colores = ["#00BFFF", "#FF6347", "#32CD32", "#FF69B4", "#8A2BE2"];
        const trabajadoresConColor = trabajadoresRes.data.map((t, i) => ({
          ...t,
          color: colores[i % colores.length],
        }));
        setTrabajadores(trabajadoresConColor);

        const { inicio, fin } = semana;
        const reservasRes = await axios.get(
          `http://localhost:5000/api/reservas/semana?inicio=${inicio}&fin=${fin}`
        );
        console.log("Reservas cargadas:", reservasRes.data); // 🔍 DEBUG
        setReservas(reservasRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
  }, [semana]);

  const diasConFecha = getDiasSemanaConFecha(semana.inicio);

  return (
    <div className="admin-calendar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <button onClick={() => cambiarSemana(-1)}>&larr; Semana anterior</button>
        <div style={{ textAlign: "center" }}>
          <h2>Semana del {formatearFecha(semana.inicio)} al {formatearFecha(semana.fin)}</h2>
          {semanaOffset !== 0 && (
            <button onClick={volverASemanaActual} style={{ marginTop: "0.5rem" }}>
              Volver a semana actual
            </button>
          )}
        </div>
        <button onClick={() => cambiarSemana(1)}>Semana siguiente &rarr;</button>
      </div>

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
                <th key={`${dia.texto}-${t.id}`} style={{ backgroundColor: t.color }}>
                  {t.nombre}
                </th>
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
                    const coincide =
                      r.trabajador.id === trabajador.id &&
                      r.fechaYHora.startsWith(dia.fechaISO) &&
                      formatoHora(fecha) === intervalo;

                    if (coincide) {
                      console.log("✅ RESERVA ENCONTRADA:", r); // 🐛 DEBUG
                    }

                    return coincide;
                  });

                  const reservaEnCurso = reservas.some((r) => {
                    if (!r || !r.fechaYHora || !r.trabajador || !r.servicio) return false;

                    const fecha = new Date(r.fechaYHora);
                    const duracionMin = r.servicio.duracion;
                    console.log("Duración de la reserva:", r.servicio.duracion);
                    const bloques = Math.ceil(duracionMin / 15);
                    const startIdx = intervalos.findIndex((i) => formatoHora(fecha) === i);

                    const enCurso =
                      r.trabajador.id === trabajador.id &&
                      r.fechaYHora.startsWith(dia.fechaISO) &&
                      idx > startIdx &&
                      idx < startIdx + bloques;

                    if (enCurso) {
                      console.log("⛔ RESERVA EN CURSO (celda bloqueada):", r); // 🐛 DEBUG
                    }

                    return enCurso;
                  });

                  if (reservaEnCurso) return null;

                  if (reserva) {
                    const bloques = Math.ceil(reserva.servicio.duracion / 15);
                    return (
                      <td key={`${dia.fechaISO}-${trabajador.id}-${intervalo}`} rowSpan={bloques}>
                        <div
                          className="bloque-reserva"
                          style={{ backgroundColor: trabajador.color }}
                          title={`${reserva.servicio.nombre} - ${formatoHora(new Date(reserva.fechaYHora))}`}
                        >
                          {reserva.servicio.nombre}
                        </div>
                      </td>
                    );
                  }

                  return <td key={`${dia.fechaISO}-${trabajador.id}-${intervalo}`}></td>;
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function cambiarSemana(offset) {
    const nuevoOffset = semanaOffset + offset;
    setSemanaOffset(nuevoOffset);
    setSemana(getSemanaConOffset(nuevoOffset));
  }

  function volverASemanaActual() {
    setSemanaOffset(0);
    setSemana(getSemanaConOffset(0));
  }
};

// ==== FUNCIONES UTILITARIAS ====

function getSemanaConOffset(offsetSemanas) {
  const hoy = new Date();
  const dia = hoy.getDay() || 7;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - dia + 1 + offsetSemanas * 7);
  const viernes = new Date(lunes);
  viernes.setDate(lunes.getDate() + 4);
  return {
    inicio: lunes.toISOString().split("T")[0],
    fin: viernes.toISOString().split("T")[0],
  };
}

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
      const hora = h.toString().padStart(2, "0");
      const minuto = m.toString().padStart(2, "0");
      intervalos.push(`${hora}:${minuto}`);
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

function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  return `${dia}/${mes}`;
}

export default AdminCalendar;
