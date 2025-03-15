import { useState, useEffect } from 'react';

const FormularioReserva = () => {
  const [datos, setDatos] = useState({
    nombre: '',
    telefono: '',
    servicio: '',
    fecha: '',
    hora: ''
  });

  const [reservas, setReservas] = useState([]);
  const [fechaMinima, setFechaMinima] = useState('');

  // Obtener la fecha actual en formato YYYY-MM-DD
  useEffect(() => {
    const hoy = new Date();
    const formatoFecha = hoy.toISOString().split('T')[0]; // Convierte a YYYY-MM-DD
    setFechaMinima(formatoFecha);
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!datos.nombre || !datos.servicio || !datos.fecha || !datos.hora) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const nuevaReserva = [...reservas, datos];
    setReservas(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(nuevaReserva));

    alert("Reserva realizada con éxito ✅");
    setDatos({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '' });
  };

  return (
    <div className="form-container">
      <h2>Reservar una cita</h2>
      <form onSubmit={handleSubmit} className="formulario-reserva">
        <label>Nombre del Cliente *</label>
        <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} required />

        <label>Teléfono (opcional)</label>
        <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} placeholder="Opcional para clientes presenciales" />

        <label>Servicio a Contratar *</label>
        <select name="servicio" value={datos.servicio} onChange={handleChange} required>
          <option value="">Selecciona un servicio</option>
          <option value="Corte de Pelo">Corte de pelo</option>
          <option value="Manicura">Manicura</option>
          <option value="Tinte de Pelo">Tinte de Pelo</option>
          <option value="Depilación Cera">Depilación Cera</option>
          <option value="Peinado">Peinado</option>
          <option value="Maquillaje">Maquillaje</option>
        </select>

        <label>Fecha *</label>
        <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} required min={fechaMinima} />

        <label>Hora *</label>
        <input type="time" name="hora" value={datos.hora} onChange={handleChange} required min="09:00" max="21:00" />

        <button type="submit">Reservar</button>
      </form>

      {reservas.length > 0 && (
        <>
          <h3>📅 Reservas Realizadas</h3>
          <ul>
            {reservas.map((reserva, index) => (
              <li key={index}>
                {reserva.nombre} - {reserva.servicio} - {reserva.fecha} a las {reserva.hora} {reserva.telefono && `(Tel: ${reserva.telefono})`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default FormularioReserva;
