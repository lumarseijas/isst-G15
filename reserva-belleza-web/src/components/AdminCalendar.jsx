import React from "react";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const intervalos = generarIntervalos();

const AdminCalendar = ({ trabajadores, reservas, servicios, semana }) => {
  const diasConFecha = getDiasSemanaConFecha(semana.inicio);

  return (
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
                        style={{ backgroundColor: colorServicio }}
                      >
                        {reserva.servicio.nombre}
                      </div>
                    </td>
                  );
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

export default AdminCalendar;
