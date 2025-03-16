import { useState, useEffect } from 'react';

const FormularioReserva = () => {
  const [datos, setDatos] = useState({
    tipo_cliente: 'online',
    cliente_online: '',
    cliente_presencial: '',
    num_tlfno: '',
    trabajador_id: '',
    servicio_id: '',
    fecha_y_hora: ''
  });

  const [servicios, setServicios] = useState([]); // Estado para almacenar los servicios

  // Obtener la lista de servicios desde el backend
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')
      .then(response => response.json())
      .then(data => setServicios(data))
      .catch(error => console.error("Error al obtener los servicios:", error));
  }, []);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datos.servicio_id || !datos.trabajador_id || !datos.fecha_y_hora) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const reservaData = {
      cliente_online: datos.tipo_cliente === 'online' ? datos.cliente_online : null,
      cliente_presencial: datos.tipo_cliente === 'presencial' ? datos.cliente_presencial : null,
      num_tlfno: datos.tipo_cliente === 'presencial' ? datos.num_tlfno : null,
      trabajador_id: datos.trabajador_id,
      servicio_id: datos.servicio_id,
      fecha_y_hora: datos.fecha_y_hora
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
        <label>Tipo de Cliente</label>
        <select name="tipo_cliente" value={datos.tipo_cliente} onChange={handleChange}>
          <option value="online">Cliente Online</option>
          <option value="presencial">Cliente Presencial</option>
        </select>

        {datos.tipo_cliente === "online" && (
          <>
            <label>ID Cliente</label>
            <input type="text" name="cliente_online" value={datos.cliente_online} onChange={handleChange} required />
          </>
        )}

        {datos.tipo_cliente === "presencial" && (
          <>
            <label>Nombre Cliente Presencial</label>
            <input type="text" name="cliente_presencial" value={datos.cliente_presencial} onChange={handleChange} required />

            <label>Teléfono</label>
            <input type="tel" name="num_tlfno" value={datos.num_tlfno} onChange={handleChange} />
          </>
        )}

        <label>Trabajador</label>
        <input type="text" name="trabajador_id" value={datos.trabajador_id} onChange={handleChange} required />

        <label>Servicio</label>
        <select name="servicio_id" value={datos.servicio_id} onChange={handleChange} required>
          <option value="">Selecciona un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombre_servicio}
            </option>
          ))}
        </select>

        <label>Fecha y Hora</label>
        <input type="datetime-local" name="fecha_y_hora" value={datos.fecha_y_hora} onChange={handleChange} required />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default FormularioReserva;
