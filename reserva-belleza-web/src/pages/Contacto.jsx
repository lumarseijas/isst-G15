import { useEffect, useState } from 'react';

const Contacto = () => {
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/trabajadores')
      .then(response => response.json())
      .then(data => setTrabajadores(data))
      .catch(error => console.error('Error al obtener trabajadores:', error));
  }, []);

  return (
    <div className="contacto-container">
      <h2>Contacta con nosotros!</h2>

      <div className="contacto-grid">
        {/* SECCIÓN IZQUIERDA: Horarios y Trabajadores */}
        <div className="info-izquierda">
          <div className="horarios">
            <h3>Horarios</h3>
            <p>🕘 Lunes a Viernes: 9:00 - 21:00</p>
            <p>📅 Sábados y Domingos: Cerrado</p>
          </div>

          <div className="trabajadores-section">
            <h3>Nuestro Equipo</h3>
            <ul>
              {trabajadores.length > 0 ? (
                trabajadores.map(trabajador => (
                  <li key={trabajador.id}>
                    {trabajador.nombre} - {trabajador.telefono}
                  </li>
                ))
              ) : (
                <p>Cargando trabajadores...</p>
              )}
            </ul>
          </div>
        </div>

        {/* SECCIÓN DERECHA: Dirección y Mapa */}
        <div className="mapa-container">
          <p className="direccion">📍 Calle Belleza, 123, Ciudad</p>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7812.391308016873!2d-3.730860967038291!3d40.48892268662849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4229d93b6f7507%3A0xbb8ebf0aab4a1624!2sMiia%20Belleza%20Saludable!5e0!3m2!1ses!2ses!4v1742131646225!5m2!1ses!2ses" 
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
