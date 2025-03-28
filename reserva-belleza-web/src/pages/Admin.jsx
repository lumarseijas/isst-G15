// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    // Aquí iría la lógica para obtener usuarios, reservas y servicios desde el backend
    // Por ahora, usamos datos de ejemplo
    setUsuarios([{ id: 1, nombre: "Lucía", email: "lucia@upm.es" }]);
    setReservas([{ id: 1, cliente: "Lucía", fecha: "2025-03-28", servicio: "Peinado" }]);
    setServicios([{ id: 1, nombre: "Corte", precio: 20 }]);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel del Administrador</h1>

      {/* Usuarios */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Usuarios registrados</h2>
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>{u.nombre} - {u.email}</li>
          ))}
        </ul>
      </section>

      {/* Reservas */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Reservas</h2>
        <ul>
          {reservas.map((r) => (
            <li key={r.id}>{r.cliente} - {r.servicio} - {r.fecha}</li>
          ))}
        </ul>
      </section>

      {/* Servicios */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Servicios</h2>
        <ul>
          {servicios.map((s) => (
            <li key={s.id}>{s.nombre} - {s.precio}€</li>
          ))}
        </ul>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/admin/servicios")}
        >
          Gestionar Servicios
        </button>
      </section>
    </div>
  );
};

export default Admin;
