import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioReserva = () => {
  const [datos, setDatos] = useState({
    nombre_cliente: '',
    servicio_id: '',
    fecha: '',
    hora: ''
  });

  const [servicios, setServicios] = useState([]);
  const [fechaValida, setFechaValida] = useState(true);
  const [errorFecha, setErrorFecha] = useState('');
  const [errorHora, setErrorHora] = useState('');
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [errorReserva, setErrorReserva] = useState('');
  const [telefono, setTelefono] = useState('');

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuario?.tipo === "ADMINISTRADOR";

  useEffect(() => {
    // Cargar servicios
    fetch('http://localhost:5000/api/servicios')
      .then(res => res.json())
      .then(data => {
        setServicios(data);
      })
      .catch(err => console.error("Error al obtener servicios:", err));

    // Si NO es admin, autocompletar nombre
    if (usuario && !esAdmin) {
      setDatos(prev => ({
        ...prev,
        nombre_cliente: usuario.nombre
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMostrarErrores(true);

    if (name === 'hora') {
      const [h] = value.split(':').map(Number);
      setErrorHora(h >= 9 && h <= 21 ? '' : "Selecciona una hora entre las 09:00 y 21:00.");
    }

    if (name === 'fecha') {
      const seleccionada = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const mañana = new Date(hoy);
      mañana.setDate(hoy.getDate() + 1);
      const dia = seleccionada.getDay(); // 0 domingo, 6 sábado

      if (seleccionada < mañana) {
        setFechaValida(false);
        setErrorFecha("No puedes seleccionar una fecha anterior a mañana.");
      } else if (dia === 0 || dia === 6) {
        setFechaValida(false);
        setErrorFecha("No puedes seleccionar fines de semana.");
      } else {
        setFechaValida(true);
        setErrorFecha('');
      }
    }

    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMostrarErrores(true);

    if (errorFecha || errorHora) {
      alert("Corrige los errores del formulario.");
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para reservar.");
      navigate("/auth");
      return;
    }

    if (!datos.nombre_cliente || !datos.servicio_id || !datos.fecha || !datos.hora) {
      alert("Completa todos los campos.");
      return;
    }

    const reservaData = {
      servicio: { id: parseInt(datos.servicio_id) },
      fechaYHora: `${datos.fecha}T${datos.hora}`
    };

    if (esAdmin) {
      reservaData.clientePresencial = datos.nombre_cliente;
      reservaData.numTlfno = telefono;
    } else {
      reservaData.clienteOnline = { id: usuario.id };
    }

    try {
      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
      });

      if (response.status === 409) {
        const mensaje = await response.text();
        setErrorReserva(mensaje);
        return;
      }

      await response.json();
      alert("Reserva realizada con éxito.");
      setErrorReserva('');
    } catch (error) {
      console.error("Error en la reserva:", error);
      setErrorReserva("Hubo un problema al registrar la reserva.");
    }
  };

  const formularioValido =
    datos.nombre_cliente.trim() !== '' &&
    datos.servicio_id.trim() !== '' &&
    datos.fecha.trim() !== '' &&
    datos.hora.trim() !== '' &&
    !errorFecha &&
    !errorHora;

  return (
    <div className="form-container">
      <h2>Reserva tu cita</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre del Cliente *</label>
        <input
          type="text"
          name="nombre_cliente"
          value={datos.nombre_cliente}
          onChange={handleChange}
          required
          disabled={!esAdmin}
        />

        {esAdmin && (
          <>
            <label>Teléfono del cliente *</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </>
        )}

        <label>Servicio *</label>
        <select
          name="servicio_id"
          value={datos.servicio_id}
          onChange={handleChange}
          required
          className={mostrarErrores && datos.servicio_id === '' ? 'input-error' : ''}
        >
          <option value="">Selecciona un servicio</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombreServicio}
            </option>
          ))}
        </select>

        <div className="form-row">
          <label>Fecha * {errorFecha && <span className="inline-error">{errorFecha}</span>}</label>
          <input
            type="date"
            name="fecha"
            value={datos.fecha}
            onChange={handleChange}
            required
            min={(() => {
              const fechaMinima = new Date();
              fechaMinima.setDate(fechaMinima.getDate() + 1);
              return fechaMinima.toISOString().split('T')[0];
            })()}
          />
        </div>

        <div className="form-row">
          <label>Hora * {errorHora && <span className="inline-error">{errorHora}</span>}</label>
          <input
            type="time"
            name="hora"
            value={datos.hora}
            onChange={handleChange}
            required
            min="09:00"
            max="21:00"
            step="300"
          />
        </div>

        {!formularioValido && (
          <span className="error-text">
            Asegúrate de haber rellenado todos los campos correctamente.
          </span>
        )}

        {errorReserva && <span className="error-text">{errorReserva}</span>}

        <button type="submit" disabled={!formularioValido}>Reservar</button>
      </form>
    </div>
  );
};

export default FormularioReserva;
