import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')));
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    alert("Sesión cerrada correctamente.");
    navigate('/auth');
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
      </ul>

      {usuario ? (
        <div className="perfil-container">
          <img 
            src={usuario.avatar || "/img/defecto.png"} 
            alt="Avatar" 
            className="avatar"
            onClick={() => setMostrarPerfil(!mostrarPerfil)}
          />
          {mostrarPerfil && (
            <div className="perfil-menu">
              <p><strong>{usuario.nombre}</strong></p>
              <p>📧 {usuario.email}</p>
              <button className="btn-editar" onClick={() => navigate('/perfil')}>Editar Perfil</button>
              <button className="btn-cerrar" onClick={handleLogout}>Cerrar Sesión</button>
              <button className="btn-cancelar" onClick={() => setMostrarPerfil(false)}>Cancelar</button>
            </div>
          )}
        </div>
      ) : (
        <div className="perfil-container">
          <img 
            src="/img/defecto.png" 
            alt="Avatar" 
            className="avatar"
            onClick={() => navigate('/auth')}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
