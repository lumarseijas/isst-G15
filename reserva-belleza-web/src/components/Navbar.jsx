import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Cargar usuario desde localStorage cuando la página se renderiza
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
  }, [setUsuario]);

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Eliminar usuario del almacenamiento
    setUsuario(null);
    setMostrarPerfil(false);
    alert("Sesión cerrada correctamente.");
    window.location.reload(); // Refresca la página para actualizar el estado
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CENTRO BELLEZA</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/reservas">Reservar</Link></li>
        {usuario?.tipo === "ADMINISTRADOR" && (
        <li><Link to="/Admin">Panel Administrador</Link></li>
        )}
      </ul>

      {/* AVATAR - Menú de perfil */}
      <div className="perfil-container">
        <img 
          src={usuario ? usuario.avatar || "/img/defecto.png" : "/img/defecto.png"} 
          alt="Avatar" 
          className="avatar"
          onClick={() => {
            if (usuario) {
              setMostrarPerfil(!mostrarPerfil);
            } else {
              navigate('/auth');
            }
          }}
        />

        {/* Menú desplegable si el usuario está logueado */}
        {usuario && mostrarPerfil && (
          <div className="perfil-menu">
            <p><strong>{usuario.nombre}</strong></p>
            <p>📧 {usuario.email}</p>
            {usuario?.tipo !== "ADMINISTRADOR" && (
            <button className="btn-editar" onClick={() => navigate('/citas')}>Mis citas</button>
            )}
            <button className="btn-editar" onClick={() => navigate('/perfil')}>Editar Perfil</button>
            <button className="btn-cerrar" onClick={handleLogout}>Cerrar Sesión</button>
            <button className="btn-cancelar" onClick={() => setMostrarPerfil(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
