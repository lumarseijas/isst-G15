import { useState, useEffect } from 'react';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  // Obtener los servicios desde el backend
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios') 
      .then(response => response.json())
      .then(data => setServicios(data))
      .catch(error => console.error("Error al obtener los servicios:", error));
  }, []);

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
            </div>
          </div>
        ))
      ) : (
        <p>Cargando servicios...</p>
      )}
    </div>
  </div>
);
};

export default Servicios;
