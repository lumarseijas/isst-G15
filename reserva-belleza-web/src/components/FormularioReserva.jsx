import { useState, useEffect } from 'react';

const FormularioReserva = ({ esAdmin }) => {  // esAdmin determina si se muestra el campo teléfono
  const [datos, setDatos] = useState({
    nombre_cliente: '',
    num_tlfno: '',
    servicio_id: '',
    fecha: '',
    hora: ''
  });

  const [servicios, setServicios] = useState([]); // Lista de servicios desde la base de datos

  // Obtener los servicios desde la API del backend
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')
      .then(response => response.json())
      .then(data => setServicios(data))
      .catch(error => console.error("Error al obtener los servicios:", error));
  }, []);

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Función para validar la fecha
  const getFechaMinima = () => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1); // Solo permite días posteriores al actual
    return hoy.toISOString().split('T')[0];
  };

  // Función para verificar que la fecha no sea sábado ni domingo
  const esDiaLaboral = (fecha) => {
    const diaSemana = new Date(fecha).getDay();
    return diaSemana !== 6 && diaSemana !== 0; // 6 = Sábado, 0 = Domingo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datos.nombre_cliente || !datos.servicio_id || !datos.fecha || !datos.hora) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (!esDiaLaboral(datos.fecha)) {
      alert("No se pueden hacer reservas los sábados ni domingos.");
      return;
    }

    const reservaData = {
      nombre_cliente: datos.nombre_cliente,
      num_tlfno: esAdmin ? datos.num_tlfno : null, // Solo envía el teléfono si es admin
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
        <input type="text" name="nombre_cliente" value={datos.nombre_cliente} onChange={handleChange} required />

        {/* Solo mostrar el campo teléfono si el usuario es admin */}
        {esAdmin && (
          <>
            <label>Teléfono (opcional)</label>
            <input type="tel" name="num_tlfno" value={datos.num_tlfno} onChange={handleChange} />
          </>
        )}

        <label>Servicio *</label>
        <select name="servicio_id" value={datos.servicio_id} onChange={handleChange} required>
          <option value="">Selecciona un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombre_servicio}
            </option>
          ))}
        </select>

        <label>Fecha *</label>
        <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} required min={getFechaMinima()} />

        <label>Hora *</label>
        <input type="time" name="hora" value={datos.hora} onChange={handleChange} required min="09:00" max="21:00" />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default FormularioReserva;
