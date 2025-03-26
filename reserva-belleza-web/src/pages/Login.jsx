import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUsuario }) => {
  const [datos, setDatos] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: {//'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (response.ok) {
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('usuario', JSON.stringify(result.usuario));
        setUsuario(result.usuario); 
        alert("Inicio de sesión exitoso");
        //necesito que se recargue antes
        navigate('/'); // Redirige al usuario a la página principal
        window.location.reload();
      } else {
        alert(result.error);
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

      <p className="registro-link">
        ¿No estás registrado? Regístrate <span onClick={() => navigate('/registro')}>aquí</span>
      </p>
    </div>
  );
};

export default Login;
