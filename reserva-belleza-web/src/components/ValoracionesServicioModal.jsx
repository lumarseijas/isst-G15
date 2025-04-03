import React from 'react';

const ValoracionesServicioModal = ({ servicio, valoraciones, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>Valoraciones de "{servicio.nombreServicio}"</h2>
        <button onClick={onClose} className="btn-cerrar-modal">Cerrar</button>

        {valoraciones.length === 0 ? (
          <p style={{ marginTop: '1rem' }}>Este servicio aún no tiene valoraciones.</p>
        ) : (
          <div className="lista-valoraciones">
            {valoraciones.map((val) => (
              <div key={val.id} className="valoracion-item">
              <p style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>
                {val.usuario?.nombre || 'Cliente'}
              </p>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    style={{
                      fontSize: '20px',
                      color: val.estrellas >= n ? '#ffc107' : '#ccc',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              {val.comentario && (
                <p style={{ marginTop: '4px' }}><em>{val.comentario}</em></p>
              )}
              {val.respuestaAdmin && (
                <p style={{ marginTop: '4px', color: '#444' }}>
                    <strong>Respuesta del centro:</strong> {val.respuestaAdmin}
                </p>
                )}

            </div>
            
            
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValoracionesServicioModal;
