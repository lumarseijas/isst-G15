import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección de Bienvenida */}
      <header className="hero">
        <h1>Bienvenido a CENTRO BELLEZA</h1>
        <p>Relájate, renuévate y cuida tu belleza con nosotros.</p>
        <Link to="/reservas" className="btn-primary">Reservar Cita</Link>
      </header>

      {/* Sección Sobre Nosotros */}
      <section className="about-section">
        <h2>Sobre Nosotros</h2>
        <p>En CENTRO BELLEZA nos especializamos en ofrecer tratamientos personalizados para el bienestar y la belleza.  
           Disfruta de una experiencia única en un ambiente acogedor y profesional.</p>
      </section>
    </div>
  );
};

export default Home;
