import { useEffect, useState } from 'react';

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      setError('Debes iniciar sesión para ver tus citas.');
      return;
    }

    fetch(`http://localhost:5000/api/reservas/cliente/${usuario.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar tus citas.');
        return res.json();
      })
      .then(data => setCitas(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="citas-wrapper">
      <h2 className="titulo-citas">Mis Citas</h2>
      {error && <p className="error-text">{error}</p>}
      {citas.length === 0 ? (
        <p className="texto-vacio">No tienes ninguna cita aún.</p>
      ) : (
        <div className="tarjetas-citas">
          {citas.map(cita => (
            <div className="tarjeta-cita" key={cita.id}>
              <h3>{cita.servicio.nombreServicio}</h3>
              <p><strong>Fecha:</strong> {new Date(cita.fechaYHora).toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {new Date(cita.fechaYHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Profesional:</strong> {cita.trabajador?.nombre || 'Por asignar'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Citas;
