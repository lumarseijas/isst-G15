import { useState, useEffect } from 'react';
import ValoracionesServicioModal from '../components/ValoracionesServicioModal';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [medias, setMedias] = useState({});
  const [valoracionesServicio, setValoracionesServicio] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')
      .then(response => response.json())
      .then(data => {
        setServicios(data);
        data.forEach(servicio => {
          fetch(`http://localhost:5000/api/valoraciones/servicio/${servicio.id}`)
            .then(res => res.json())
            .then(valoraciones => {
              if (valoraciones.length > 0) {
                const suma = valoraciones.reduce((acc, val) => acc + val.estrellas, 0);
                const media = (suma / valoraciones.length).toFixed(1);
                setMedias(prev => ({ ...prev, [servicio.id]: media }));
              }
            });
        });
      })
      .catch(error => console.error("Error al obtener los servicios:", error));
  }, []);

  const abrirModal = (servicio) => {
    fetch(`http://localhost:5000/api/valoraciones/servicio/${servicio.id}`)
      .then(res => res.json())
      .then(data => {
        setValoracionesServicio(data);
        setServicioSeleccionado(servicio);
      });
  };

  const cerrarModal = () => {
    setValoracionesServicio([]);
    setServicioSeleccionado(null);
  };

  return (
    <div className="servicios-container">
      <h2>Lista de Servicios Disponibles</h2>
      <div className="servicios-grid">
        {servicios.length > 0 ? (
          servicios.map((servicio) => (
            <div key={servicio.id} className="servicio-card">
              <img src={servicio.imagen} alt={servicio.nombreServicio} className="servicio-img" />
              <div className="servicio-info">
                <h3>{servicio.nombreServicio}</h3>
                <p>Duración: {servicio.duracion} min</p>
                <p>Precio: {servicio.precio}€</p>
                {medias[servicio.id] && (
                  <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#ffc107', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                    ⭐ {medias[servicio.id]} / 5
                  </p>
                  <button
                    onClick={() => abrirModal(servicio)}
                    style={{
                      backgroundColor: '#ffc107',
                      border: 'none',
                      color: '#000',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Ver valoraciones
                  </button>
                </div>
                
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Cargando servicios...</p>
        )}
      </div>

      {servicioSeleccionado && (
        <ValoracionesServicioModal
          servicio={servicioSeleccionado}
          valoraciones={valoracionesServicio}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
};

export default Servicios;
