import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservaEditarModal = ({ reserva, onClose, onGuardar }) => {
  const [fechaYHora, setFechaYHora] = useState(reserva.fechaYHora);
  const [servicioId, setServicioId] = useState(reserva.servicio.id);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/servicios");
        setServiciosDisponibles(res.data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };
    fetchServicios();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const servicioSeleccionado = serviciosDisponibles.find(s => s.id === servicioId);

    const reservaActualizada = {
      ...reserva,
      fechaYHora,
      servicio: {
        ...reserva.servicio,
        id: servicioId,
        nombreServicio: servicioSeleccionado?.nombreServicio
      }
    };

    onGuardar(reservaActualizada);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>Editar Reserva</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Fecha y Hora:
            <input
              type="datetime-local"
              value={fechaYHora}
              onChange={(e) => setFechaYHora(e.target.value)}
              required
            />
          </label>

          <label>
            Servicio:
            <select
              value={servicioId}
              onChange={(e) => setServicioId(Number(e.target.value))}
              required
            >
              <option value="">Seleccione un servicio</option>
              {serviciosDisponibles.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombreServicio}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-botones">
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaEditarModal;