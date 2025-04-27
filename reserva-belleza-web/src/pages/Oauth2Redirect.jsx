import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Redirect = ({ setUsuario }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const id = params.get('id');
    const nombre = params.get('nombre');
    const email = params.get('email');
    const token = params.get('token');

    if (id && nombre && email && token) {
      const usuario = { id, nombre, email };

      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);
      setUsuario(usuario);

      alert(`¡Bienvenido/a ${nombre}!`);

      navigate('/');
      window.location.reload();
    } else {
      alert('Error al iniciar sesión con Google.');
      navigate('/login');
    }
  }, []);

  return <div>Cargando...</div>;
};

export default OAuth2Redirect;
