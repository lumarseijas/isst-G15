import React from "react";

const ReservaDetalleModal = ({ reserva, onClose, onEditar, onCancelar }) => {
  if (!reserva) return null;

  const cliente =
    reserva.clienteOnline?.nombre || reserva.clientePresencial || "Desconocido";

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>Detalles de la Reserva</h2>
        <p><strong>Cliente:</strong> {cliente}</p>
        <p><strong>Servicio:</strong> {reserva.servicio.nombreServicio}</p>
        <p><strong>Trabajador:</strong> {reserva.trabajador.nombre}</p>
        <p><strong>Fecha y Hora:</strong> {new Date(reserva.fechaYHora).toLocaleString()}</p>

        <div className="modal-botones">
          <button onClick={onEditar}>✏️ Editar</button>
          <button onClick={onCancelar} style={{ backgroundColor: "#e74c3c" }}>❌ Cancelar reserva</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetalleModal;
