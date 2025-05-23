import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCalendar from "../components/AdminCalendar";
import DiaLibreModal from "../components/DiaLibreModal";
import { useNavigate } from "react-router-dom";

// Función para generar colores únicos con HSL
const generarColoresUnicos = (cantidad) => {
  const colores = [];
  const saturacion = 70;
  const luminosidad = 60;
  for (let i = 0; i < cantidad; i++) {
    const hue = Math.floor((360 / cantidad) * i);
    colores.push(`hsl(${hue}, ${saturacion}%, ${luminosidad}%)`);
  }
  return colores;
};

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
  const [mediaPorTrabajador, setMediaPorTrabajador] = useState({});
  const [trabajadoresVisibles, setTrabajadoresVisibles] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [serviciosVisibles, setServiciosVisibles] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [semana, setSemana] = useState(getSemanaConOffset(0));
  const [mostrarModalDiaLibre, setMostrarModalDiaLibre] = useState(false);
  const navigate = useNavigate();

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

        trabajadoresRes.data.forEach(async (trabajador) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/valoraciones/media/trabajador/${trabajador.id}`);
            if (res.data !== null) {
              setMediaPorTrabajador(prev => ({
                ...prev,
                [trabajador.id]: parseFloat(res.data).toFixed(1)
              }));
            }
          } catch (err) {
            console.error("Error al obtener media del trabajador", trabajador.id, err);
          }
        });

        const serviciosRes = await axios.get("http://localhost:5000/api/servicios");
        const colores = generarColoresUnicos(serviciosRes.data.length);
        const serviciosConColor = serviciosRes.data.map((s, i) => ({
          ...s,
          color: colores[i],
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

  const eliminarServicio = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este servicio?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/servicios/${id}`);
      setServicios(servicios.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al eliminar el servicio", error);
      alert("No se pudo eliminar el servicio");
    }
  };

  const eliminarTrabajador = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este trabajador?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trabajadores/${id}`);
      setTrabajadores(trabajadores.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar el trabajador", error);
      alert("No se pudo eliminar el trabajador");
    }
  };

  return (
    <div className="admin-calendar-layout">
      <div className="sidebar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h3 style={{ margin: 0, color: "#5a2e7d" }}>Servicios</h3>
          <button
            onClick={() => navigate("/servicios/nuevo")}
            style={{
              backgroundColor: "transparent",
              color: "#5a2e7d",
              border: "none",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            title="Añadir servicio"
          >
            +
          </button>
        </div>

        <ul style={{ padding: 0, margin: 0 }}>
          {servicios.map((s) => (
            <li key={s.id}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
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
                <span style={{ flex: 1, fontWeight: "500", whiteSpace: "nowrap"  }}>{s.nombre}</span>
                </div>
                </label>
              <button
                onClick={() => eliminarServicio(s.id)}
                style={{
                  marginLeft: "auto",
                backgroundColor: "transparent",
                color: "#ff0000",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                lineHeight: "0",
                alignItems: "center",
                width: "920%", //me lo he inventdo para q este a la dcha
                padding: 0,
                }}
                title="Eliminar servicio"
              >
                –
              </button>

            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
          <h3 style={{ margin: 0  }}>Trabajadores</h3>
          <button
            onClick={() => navigate("/trabajadores/nuevo")}
            style={{
              backgroundColor: "transparent",
              color: "#5a2e7d",
              border: "none",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            title="Añadir trabajador"
          >
            +
          </button>
        </div>
        <ul style={{ padding: 0, margin: 0 }}>
          {trabajadores.map((t) => (
            <li key={t.id} style={{ marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={trabajadoresVisibles.includes(t.id)}
                    onChange={() => toggleTrabajador(t.id)}
                  />
                  <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                    {t.nombre} ({contarReservasTrabajador(t.id)})
                  </span>
                </div>
                {mediaPorTrabajador[t.id] && (
                  <span
                    style={{
                      color: "#ffc107",
                      fontSize: "0.9rem",
                      marginLeft: "1.7rem", // para alinear con el nombre
                      whiteSpace: "nowrap"
                    }}
                  >
                    ⭐ {mediaPorTrabajador[t.id]} / 5
                  </span>
                )}
              </div>
              <button
                onClick={() => eliminarTrabajador(t.id)}
                style={{
                  backgroundColor: "transparent",
                  color: "#ff0000",
                  fontSize: "24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "none",
                  lineHeight: "1.5",
                  padding: 0,
                  marginLeft: "10rem" // separación del bloque izquierdo
                }}
                title="Eliminar trabajador"
              >
                –
              </button>
            </div>
          </li>
          
          
            

              


            
          ))}
        </ul>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={() => navigate("/reservas")}
            style={{
              backgroundColor: "#b48ec6",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "20px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ➕ Añadir cita
          </button>
          <button
            onClick={() => setMostrarModalDiaLibre(true)}
            style={{
              backgroundColor: "#5a2e7d",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "20px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            📅 Pedir día libre
          </button>

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
      {mostrarModalDiaLibre && (
  <DiaLibreModal
    trabajadores={trabajadores}
    onClose={() => setMostrarModalDiaLibre(false)}
    onDiaLibreConfirmado={fetchReservas}
  />
)}

    </div>
  );
};

export default Admin;
