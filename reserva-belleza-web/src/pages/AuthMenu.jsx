import { Link } from 'react-router-dom';

const AuthMenu = () => {
  return (
    <div className="auth-container">
      <h2>Bienvenido</h2>
      <p>Accede a tu cuenta o regístrate para continuar.</p>
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn">Iniciar Sesión</Link>
        <Link to="/registro" className="auth-btn">Registrarse</Link>
      </div>
    </div>
  );
};

export default AuthMenu;
