import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const avataresDisponibles = [
  "/img/avatar1.png",
  "/img/avatar2.png",
  "/img/avatar3.png",
  "/img/avatar4.png"
];

const Registro = () => {
  const navigate = useNavigate();
  
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    avatar: avataresDisponibles[0] // Avatar por defecto
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (avatar) => {
    setDatos({ ...datos, avatar });
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

      if (response.ok) {
        alert("Registro exitoso 🎉");
        navigate('/auth'); // Redirigir a la página de autenticación
      } else {
        alert(result.error);
      }
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

        <label>Teléfono (opcional)</label>
        <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} />

        <label>Contraseña</label>
        <input type="password" name="password" value={datos.password} onChange={handleChange} required />

        <label>Selecciona tu avatar</label>
        <div className="avatar-selection">
          {avataresDisponibles.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`avatar-option ${datos.avatar === avatar ? "selected" : ""}`}
              onClick={() => handleAvatarChange(avatar)}
            />
          ))}
        </div>

        <img src={datos.avatar} alt="Vista previa" className="avatar-preview" />

        <button type="submit">Registrar</button>
      </form>

      {/* Línea de inicio de sesión */}
      <p className="registro-link">
        ¿Ya tienes cuenta? Inicia sesión <span onClick={() => navigate('/login')}>aquí</span>
      </p>
    </div>
  );
};

export default Registro;
