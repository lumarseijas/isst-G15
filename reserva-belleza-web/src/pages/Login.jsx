import { useState } from 'react';

const Login = () => {
  const [datos, setDatos] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!datos.email || !datos.password) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

    // Enviar datos al backend cuando esté listo
    console.log("Datos enviados:", datos);

    alert("Inicio de sesión exitoso (Simulación)");
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
