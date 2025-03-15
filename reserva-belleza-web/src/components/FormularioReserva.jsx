import { useState } from "react";

const FormularioReserva = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    servicio: "",
    fecha_hora: "",
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar el formulario (por ahora solo muestra los datos en consola)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reserva enviada:", formData);
    alert("Reserva realizada con éxito"); // temporal hasta conectarlo con backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reserva tu cita</h3>

      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

    {/* Mostrar el campo de teléfono solo si el usuario es administrador */}
    {/*isAdmin && */}
       <label>Teléfono:</label>
       <input
         type="text"
         name="telefono"
         value={formData.telefono}
         onChange={handleChange}
       />       

      <label>Servicio:</label>
      <select
        name="servicio"
        value={formData.servicio}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un servicio</option>
        <option value="Corte de pelo">Corte de pelo</option>
        <option value="Manicura">Manicura</option>
        <option value="Masaje">Masaje</option>
      </select>

      <label>Fecha y Hora:</label>
      <input
        type="datetime-local"
        name="fecha_hora"
        value={formData.fecha_hora}
        onChange={handleChange}
        required
      />

      <button type="submit">Reservar</button>
    </form>
  );
};

export default FormularioReserva;
