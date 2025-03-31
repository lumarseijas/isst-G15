import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservaEditarModal from './ReservaEditarModal';

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCitas();
  }, []);
  
  const cargarCitas = () => {
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
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;

    fetch(`http://localhost:5000/api/reservas/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo eliminar la cita.');
        setCitas(prevCitas => prevCitas.filter(c => c.id !== id));
      })
      .catch(err => alert(err.message));
  };

  const handleEditar = (id) => {
    const cita = citas.find(c => c.id === id);
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
  };
  
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
              <div className="botones-cita">
                <button onClick={() => handleEditar(cita.id)} className="btn-editar">Editar</button>
                <button onClick={() => handleEliminar(cita.id)} className="btn-eliminar">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarModal && (
        <ReservaEditarModal
          reserva={citaSeleccionada}
          onClose={handleCerrarModal}
          //
          onGuardar={async (reservaActualizada) => {
            try {
              await fetch(`http://localhost:5000/api/reservas/${reservaActualizada.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaActualizada),
              });
          
              handleCerrarModal();
              cargarCitas(); // Recarga la lista con los datos actualizados
            } catch (error) {
              alert('Error al guardar los cambios de la reserva');
              console.error(error);
            }
          }}
        />
      )}



    </div>
  );
};
export default Citas;
