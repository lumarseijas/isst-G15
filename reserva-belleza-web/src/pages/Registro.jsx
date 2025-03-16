import { useState } from 'react';

const Registro = () => {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datos.nombre || !datos.email || !datos.password) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();
      alert(result.mensaje);
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre</label>
        <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={datos.email} onChange={handleChange} required />

        <label>Teléfono</label>
        <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} />

        <label>Contraseña</label>
        <input type="password" name="password" value={datos.password} onChange={handleChange} required />

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Registro;
