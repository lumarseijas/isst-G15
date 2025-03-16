import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Título en negrita */}
      <div className="logo">
        <Link to="/">RESERVA BELLEZA</Link>
      </div>

      {/* Menú de navegación */}
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/reservas">Reservar</Link></li>
      </ul>

      {/* Botón circular para autenticación */}
      <Link to="/auth" className="auth-button"></Link>
    </nav>
  );
};

export default Navbar;
