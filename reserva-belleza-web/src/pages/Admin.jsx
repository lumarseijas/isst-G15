import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCalendar from "../components/AdminCalendar";

const getSemanaConOffset = (offsetSemanas) => {
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
};

const Admin = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresVisibles, setTrabajadoresVisibles] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [serviciosVisibles, setServiciosVisibles] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [semana, setSemana] = useState(getSemanaConOffset(0));

  const fetchReservas = async () => {
    try {
      const { inicio, fin } = semana;
      const reservasRes = await axios.get(
        `http://localhost:5000/api/reservas/semana?inicio=${inicio}&fin=${fin}`
      );
      setReservas(reservasRes.data);
    } catch (err) {
      console.error("Error al recargar reservas:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trabajadoresRes = await axios.get("http://localhost:5000/api/trabajadores");
        setTrabajadores(trabajadoresRes.data);
        setTrabajadoresVisibles(trabajadoresRes.data.map((t) => t.id));

        const colores = ["#00BFFF", "#FF6347", "#32CD32", "#FF69B4", "#8A2BE2", "#FFA500", "#9370DB"];
        const serviciosRes = await axios.get("http://localhost:5000/api/servicios");
        const serviciosConColor = serviciosRes.data.map((s, i) => ({
          ...s,
          color: colores[i % colores.length],
          nombre: s.nombreServicio,
        }));
        setServicios(serviciosConColor);
        setServiciosVisibles(serviciosConColor.map((s) => s.id));

        fetchReservas();
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, [semana]);

  const cambiarSemana = (offset) => {
    const nuevoOffset = semanaOffset + offset;
    setSemanaOffset(nuevoOffset);
    setSemana(getSemanaConOffset(nuevoOffset));
  };

  const volverASemanaActual = () => {
    setSemanaOffset(0);
    setSemana(getSemanaConOffset(0));
  };

  const toggleTrabajador = (id) => {
    setTrabajadoresVisibles((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const toggleServicio = (id) => {
    setServiciosVisibles((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const contarReservasTrabajador = (trabajadorId) => {
    return reservas.filter((r) => r.trabajador?.id === trabajadorId).length;
  };

  const reservasFiltradas = reservas.filter(
    (r) =>
      trabajadoresVisibles.includes(r.trabajador?.id) &&
      serviciosVisibles.includes(r.servicio?.id)
  );

  return (
    <div className="admin-calendar-layout">
      <div className="sidebar">
        <h3 style={{ marginBottom: "1rem" }}>Servicios</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {servicios.map((s) => (
            <li key={s.id}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                <input
                  type="checkbox"
                  checked={serviciosVisibles.includes(s.id)}
                  onChange={() => toggleServicio(s.id)}
                />
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: s.color,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                ></span>
                <span style={{ flex: 1 }}>{s.nombre}</span>
              </label>
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: "1rem" }}>Trabajadores</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {trabajadores.map((t) => (
            <li key={t.id}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                }}
              >
                <input
                  type="checkbox"
                  checked={trabajadoresVisibles.includes(t.id)}
                  onChange={() => toggleTrabajador(t.id)}
                />
                <span>
                  {t.nombre} ({contarReservasTrabajador(t.id)})
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button onClick={() => cambiarSemana(-1)}>← Semana anterior</button>
          <button onClick={volverASemanaActual}>Semana actual</button>
          <button onClick={() => cambiarSemana(1)}>Semana siguiente →</button>
        </div>
      </div>

      <div className="calendar-container">
        <AdminCalendar
          trabajadores={trabajadores.filter((t) => trabajadoresVisibles.includes(t.id))}
          reservas={reservasFiltradas}
          servicios={servicios}
          semana={semana}
          recargarReservas={fetchReservas}
        />
      </div>
    </div>
  );
};

export default Admin;
