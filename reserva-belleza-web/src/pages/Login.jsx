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

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(result.usuario)); // Guardar usuario en sesión
        localStorage.setItem('token', result.token); // Guardar token
        alert("Inicio de sesión exitoso");
        navigate('/reservas'); // Redirige a la página de reservas
      } else {
        alert(result.error); // Muestra mensaje de error
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
        {/* Línea de registro */}
      <p className="registro-link">
        ¿No estás registrado? Regístrate <span onClick={() => navigate('/registro')}>aquí</span>
      </p>
      </form>
    </div>
  );
};

export default Login;