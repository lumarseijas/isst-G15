import React, { useState, useEffect } from "react";

const DiaLibreModal = ({ trabajadores, onClose, onDiaLibreConfirmado }) => {
  const today = new Date();
  const [trabajadorId, setTrabajadorId] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [mesActual, setMesActual] = useState(today.getMonth());
  const [anioActual, setAnioActual] = useState(today.getFullYear());
  const [diasOcupados, setDiasOcupados] = useState([]);

  const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

  const toggleDia = (fechaStr) => {
    setDiasSeleccionados((prev) =>
      prev.includes(fechaStr)
        ? prev.filter((d) => d !== fechaStr)
        : [...prev, fechaStr]
    );
  };

  const generarCalendario = () => {
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const dias = [];

    let diaSemana = primerDia.getDay(); // 0=domingo, 1=lunes,...
    diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

    // Huecos antes del primer día del mes
    for (let i = 0; i < diaSemana; i++) {
      dias.push(null);
    }

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(new Date(anioActual, mesActual, i));
    }

    return dias;
  };

  const esSeleccionable = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dia = fecha.getDay();
    const fechaStr = formatearFecha(fecha);
  
    return (
      fecha >= hoy &&
      dia !== 0 &&
      dia !== 6 &&
      !diasOcupados.includes(fechaStr)
    );
  };
  

  const formatearFecha = (fecha) =>
    fecha.toISOString().split("T")[0]; // yyyy-mm-dd

  const confirmar = async () => {
    if (!trabajadorId || diasSeleccionados.length === 0) {
      alert("Selecciona un trabajador y al menos un día.");
      return;
    }

    try {
      await Promise.all(
        diasSeleccionados.map((fecha) =>
          fetch("http://localhost:5000/api/dias-no-disponibles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trabajadorId, fecha }),
          })
        )
      );
      alert("Días libres registrados correctamente.");
      onDiaLibreConfirmado();
      onClose();
    } catch (err) {
      console.error("Error al guardar días libres:", err);
      alert("Hubo un error al guardar los días libres.");
    }
  };

  const diasMes = generarCalendario();


  useEffect(() => {
    const cargarReservasTrabajador = async () => {
      if (!trabajadorId) {
        setDiasOcupados([]);
        return;
      }
  
      try {
        const res = await fetch(`http://localhost:5000/api/reservas/trabajador/${trabajadorId}`);
        const data = await res.json();
  
        const fechasReservadas = data.map((r) => r.fechaYHora.split("T")[0]);
        setDiasOcupados(fechasReservadas);
      } catch (err) {
        console.error("Error al obtener reservas del trabajador:", err);
      }
    };
  
    cargarReservasTrabajador();
  }, [trabajadorId]);


  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Pedir días libres</h2>

        <label style={styles.label}>Selecciona trabajador:</label>
        <select
          style={styles.select}
          value={trabajadorId}
          onChange={(e) => setTrabajadorId(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          {trabajadores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>

        <div style={styles.calendarContainer}>
          <div style={styles.calendarHeader}>
            <button onClick={() => setMesActual((m) => (m === 0 ? 11 : m - 1))}>
              ◀
            </button>
            <span>
              {new Date(anioActual, mesActual).toLocaleString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={() => setMesActual((m) => (m === 11 ? 0 : m + 1))}>
              ▶
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                {diasSemana.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {
                // render en filas de 7 días
                Array.from({ length: Math.ceil(diasMes.length / 7) }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {diasMes.slice(rowIndex * 7, rowIndex * 7 + 7).map((fecha, colIndex) => {
                      if (!fecha) return <td key={colIndex}></td>;

                      const fechaStr = formatearFecha(fecha);
                      const seleccionada = diasSeleccionados.includes(fechaStr);
                      const esValida = esSeleccionable(fecha);

                      return (
                        <td
                          key={colIndex}
                          onClick={() => esValida && toggleDia(fechaStr)}
                          style={{
                            ...styles.dia,
                            backgroundColor: seleccionada ? "#d9c3e5" : "#fff",
                            color: esValida ? "black" : "#ccc",
                            cursor: esValida ? "pointer" : "default",
                          }}
                          title={
                            !esValida
                              ? "No disponible"
                              : seleccionada
                              ? "Desmarcar día"
                              : "Marcar día"
                          }
                        >
                          {fecha.getDate()}
                        </td>
                      );
                    })}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.confirmBtn} onClick={confirmar}>
            Confirmar
          </button>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "450px",
    maxWidth: "95vw",
  },
  label: { fontWeight: "bold", marginBottom: "0.5rem", display: "block" },
  select: { width: "100%", padding: "0.5rem", marginBottom: "1rem" },
  calendarContainer: { marginBottom: "1.5rem" },
  calendarHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "0.5rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
  },
  dia: {
    border: "1px solid #ddd",
    padding: "0.5rem",
    width: "40px", height: "40px",
    userSelect: "none",
    borderRadius: "8px",
  },
  buttonRow: {
    display: "flex", justifyContent: "flex-end", gap: "1rem",
  },
  confirmBtn: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default DiaLibreModal;
