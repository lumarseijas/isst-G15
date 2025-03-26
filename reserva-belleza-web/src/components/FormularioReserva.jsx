import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioReserva = () => {
  const [datos, setDatos] = useState({
    nombre_cliente: '',
    servicio_id: '',
    fecha: '',
    hora: ''
  });

  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  // Cargar los servicios y el usuario logueado al iniciar
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')
      .then(response => response.json())
      .then(data => {
        console.log("Servicios cargados en formulario:", data); // debug
        setServicios(data);
      })
      .catch(error => console.error("Error al obtener los servicios:", error));

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setDatos(prevDatos => ({
        ...prevDatos,
        nombre_cliente: usuario.nombre // Autorellenar el nombre
      }));
    }
  }, []);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      alert("Debes iniciar sesión o registrarte para reservar un servicio.");
      navigate('/auth'); // Redirige a la autenticación
      return;
    }

    
    if (!datos.nombre_cliente || !datos.servicio_id || !datos.fecha || !datos.hora) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const reservaData = {
      cliente_online: usuario.id,
      servicio_id: datos.servicio_id,
      fecha_y_hora: `${datos.fecha} ${datos.hora}`
    };

    try {
      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
      });

      const result = await response.json();
      alert(result.mensaje);
    } catch (error) {
      console.error("Error en la reserva:", error);
      alert("Hubo un problema al registrar la reserva.");
    }
  };

  return (
    <div className="form-container">
      <h2>Reserva tu cita</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre del Cliente *</label>
        <input 
          type="text" 
          name="nombre_cliente" 
          value={datos.nombre_cliente} 
          onChange={handleChange} 
          required 
          disabled={!!JSON.parse(localStorage.getItem('usuario'))} // Solo editable si no está logueado
        />

        <label>Servicio *</label>
        <select name="servicio_id" value={datos.servicio_id} onChange={handleChange} required>
          <option value="">Selecciona un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombreServicio}
            </option>
          ))}
        </select>

        <label>Fecha *</label>
        <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} required />

        <label>Hora *</label>
        <input type="time" name="hora" value={datos.hora} onChange={handleChange} required min="09:00" max="21:00" />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default FormularioReserva;