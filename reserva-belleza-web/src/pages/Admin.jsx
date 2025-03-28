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
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [semana, setSemana] = useState(getSemanaConOffset(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener trabajadores
        const trabajadoresRes = await axios.get("http://localhost:5000/api/trabajadores");
        setTrabajadores(trabajadoresRes.data);
        setTrabajadoresVisibles(trabajadoresRes.data.map((t) => t.id));

        // Obtener servicios y asignar color a cada uno
        const colores = ["#00BFFF", "#FF6347", "#32CD32", "#FF69B4", "#8A2BE2", "#FFA500", "#9370DB"];
        const serviciosRes = await axios.get("http://localhost:5000/api/servicios");
        console.log("✅ Servicios cargados:", serviciosRes.data); // <-- debug aquí
        const serviciosConColor = serviciosRes.data.map((s, i) => ({
          ...s,
          color: colores[i % colores.length],
        }));
        console.log("🎨 Servicios con color:", serviciosConColor); // <-- otro debug
        setServicios(serviciosConColor);

        // Obtener reservas de esta semana
        const { inicio, fin } = semana;
        const reservasRes = await axios.get(
          `http://localhost:5000/api/reservas/semana?inicio=${inicio}&fin=${fin}`
        );
        setReservas(reservasRes.data);
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

  const contarReservasTrabajador = (trabajadorId) => {
    return reservas.filter((r) => r.trabajador && r.trabajador.id === trabajadorId).length;
  };

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
        <input type="checkbox" checked={true} readOnly />
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
        <span style={{ flex: 1 }}>{s.nombreServicio}</span>
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
                  autoComplete="off"
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
          reservas={reservas}
          servicios={servicios}
          semana={semana}
        />
      </div>
    </div>
  );
};

export default Admin;
