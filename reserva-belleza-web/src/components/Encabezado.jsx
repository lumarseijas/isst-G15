import { Link } from "react-router-dom";

const Encabezado = () => {
  return (
    <nav>
      <h1>Reserva Belleza</h1>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
};

export default Encabezado;
