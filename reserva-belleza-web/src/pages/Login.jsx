import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [datos, setDatos] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem('usuario', JSON.stringify(result)); // Guardamos sesión
        alert("Inicio de sesión exitoso ✅");
        navigate('/reservas'); // Redirige al formulario de reservas
      } else {
        alert("Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Hubo un problema al iniciar sesión.");
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Email</label>
        <input type="email" name="email" value={datos.email} onChange={handleChange} required />

        <label>Contraseña</label>
        <input type="password" name="password" value={datos.password} onChange={handleChange} required />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
