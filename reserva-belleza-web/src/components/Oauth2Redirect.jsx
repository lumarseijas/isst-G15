import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
const Oauth2Redirect = ({ setUsuario }) => {
  const navigate = useNavigate();
 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get('nombre');
    const email = params.get('email');
    const token = params.get('token');
 
    if (token && nombre && email) {
      const usuario = { nombre, email };
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
      alert('Inicio de sesión con Google exitoso');
      navigate('/');
      window.location.reload();
    } else {
      alert('Error en el login con Google');
      navigate('/login');
    }
  }, [navigate, setUsuario]);
 
  return <p>Procesando inicio de sesión con Google...</p>;
};
 
export default Oauth2Redirect;