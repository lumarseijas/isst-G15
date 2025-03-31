import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservaEditarModal = ({ reserva, onClose, onGuardar }) => {
  const [fechaYHora, setFechaYHora] = useState(reserva.fechaYHora);
  const [servicioId, setServicioId] = useState(reserva.servicio.id);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
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

    try {
      const res = await fetch(`http://localhost:5000/api/reservas/${reservaActualizada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaActualizada),
      });

      if (res.status === 409) {
        const mensaje = await res.text();
        setError(mensaje);
        return;
      }

      if (!res.ok) {
        throw new Error('Error al guardar los cambios de la reserva');
      }

      onGuardar(); // solo si fue exitoso
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
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

          {error && <p className="error-text" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

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
