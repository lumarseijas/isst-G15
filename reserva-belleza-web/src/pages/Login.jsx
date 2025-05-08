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
      <p
      style={{ color: '#007bff', cursor: 'pointer', marginTop: '10px', textAlign: 'center' }}
      onClick={() => {
        const email = prompt("Introduce tu correo para recuperar la contraseña:");
        if (!email) return;

        fetch("http://localhost:5000/api/usuarios/recuperar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        })
          .then(res => {
            if (!res.ok) throw new Error("No se pudo recuperar la contraseña.");
            return res.text();
          })
          .then(msg => alert(msg))
          .catch(() => alert("No se encontró una cuenta con ese email."));
      }}
    >
      ¿Olvidaste tu contraseña?
    </p>


      <p className="registro-link">
        ¿No estás registrado? Regístrate <span onClick={() => navigate('/registro')}>aquí</span>
      </p>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  <a href="http://localhost:5000/oauth2/authorization/google" style={{ textDecoration: 'none' }}>
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#555',
        border: '1px solid #ddd',
        padding: '10px 15px',
        borderRadius: '5px',
        fontWeight: '500',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        cursor: 'pointer'
      }}
    >
      <img
        src="/public/img/google.png"
        alt="Google logo"
        style={{ width: '20px', height: '20px', marginRight: '10px' }}
      />
      Iniciar sesión con Google
    </button>
  </a>
</div>

    </div>
  );
};

export default Login;
