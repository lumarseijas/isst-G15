import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuario'); // Elimina la sesión
    alert("Sesión cerrada correctamente.");
    navigate('/auth'); // Redirige a la página de autenticación
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
        <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
      ) : (
        <Link to="/auth" className="auth-button"></Link>
      )}
    </nav>
  );
};

export default Navbar;
