import React, { useEffect, useState } from "react";

const ReservaDetalleModal = ({ reserva, onClose, onEditar, onCancelar }) => {
  const [valoracion, setValoracion] = useState(null);
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    if (reserva) {
      fetch(`http://localhost:5000/api/valoraciones/reserva/${reserva.id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.id) {
            setValoracion(data);
            setRespuesta(data.respuestaAdmin || "");
          }
        });
    }
  }, [reserva]);

  const enviarRespuesta = () => {
    fetch(`http://localhost:5000/api/valoraciones/${valoracion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...valoracion, respuestaAdmin: respuesta })
    })
      .then(res => res.json())
      .then(actualizada => {
        setValoracion(actualizada);
        alert("Respuesta enviada correctamente ✅");
      });
  };

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

        {valoracion && (
          <div className="comentario-cliente" style={{ marginTop: "1rem" }}>
            <p><strong>⭐ Valoración del cliente:</strong> {valoracion.estrellas} estrellas</p>
            {valoracion.comentario && <p><strong>📝 Comentario:</strong> {valoracion.comentario}</p>}
            <hr />
            {valoracion.respuestaAdmin ? (
              <p><strong>Respuesta del centro:</strong> {valoracion.respuestaAdmin}</p>
            ) : (
              <>
                <label><strong>Responder al cliente:</strong></label>
<textarea
  value={respuesta}
  onChange={(e) => setRespuesta(e.target.value)}
  placeholder="Escribe tu respuesta..."
  style={{ width: '100%', minHeight: '60px', marginBottom: '0.5rem' }}
/>
<div style={{ display: 'flex'}}>
  <button
    onClick={enviarRespuesta}
    style={{
      padding: '6px 6px',
      fontSize: '0.9rem',
      backgroundColor: '#ffc107',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer'
    }}
  >
    Enviar respuesta
  </button>
</div>

              </>
            )}
          </div>
        )}

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
