import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('usuario', JSON.stringify(result.usuario));
        setUsuario(result.usuario);
        alert("Inicio de sesión exitoso");
        navigate('/');
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Hubo un problema al iniciar sesión.");
    }
  };

  const handleCallbackResponse = async (response) => {
    console.log("Respuesta de Google:", response);
    const idToken = response.credential;
    console.log("ID Token recibido:", idToken);

    try {
      const res = await axios.post("http://localhost:5000/api/oauth/google", {
        token: idToken,
      });

      const usuario = res.data;
      console.log("Respuesta del backend:", usuario);

      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUsuario(usuario);
      alert(`¡Bienvenido/a ${usuario.nombre}!`);
      navigate('/');
      window.location.reload();
    } catch (e) {
      console.error("Error en login con Google:", e);
      alert("Hubo un problema al iniciar sesión con Google.");
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
        ux_mode: "popup",
        auto_select: false,
      });
      console.log("🧪 Client ID cargado:", import.meta.env.VITE_GOOGLE_CLIENT_ID);


      window.google.accounts.id.renderButton(
        document.getElementById("google-login-div"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.error("Google Identity Services no se ha cargado.");
    }
  }, []);

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

      <hr style={{ margin: '20px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div id="google-login-div"></div>
      </div>
    </div>
  );
};

export default Login;