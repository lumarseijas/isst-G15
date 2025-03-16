import { useState, useEffect } from 'react';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  // Obtener los servicios desde el backend
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')  // Asegúrate de que esta ruta coincide con tu backend
      .then(response => response.json())
      .then(data => setServicios(data))
      .catch(error => console.error("Error al obtener los servicios:", error));
  }, []);

  return (
    <div className="servicios-container">
      <h2>Lista de Servicios Disponibles</h2>
      <ul className="lista-servicios">
        {servicios.length > 0 ? (
          servicios.map((servicio) => (
            <li key={servicio.id} className="servicio-item">
              <strong>{servicio.nombre_servicio}</strong> - {servicio.duracion} min - ${servicio.precio}
            </li>
          ))
        ) : (
          <p>Cargando servicios...</p>
        )}
      </ul>
    </div>
  );
};

export default Servicios;
