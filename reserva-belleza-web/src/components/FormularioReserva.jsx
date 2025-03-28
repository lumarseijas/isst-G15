import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/*import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
*/
/*
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
*/

const FormularioReserva = () => {
  const [datos, setDatos] = useState({
    nombre_cliente: '',
    servicio_id: '',
    fecha: '',
    hora: ''
  });

  const [servicios, setServicios] = useState([]);
  const [fechaValida, setFechaValida] = useState(true); // Controlar si la fecha es válida (lunes-viernes)
  const navigate = useNavigate();
  const [errorFecha, setErrorFecha] = useState('');
  const [errorHora, setErrorHora] = useState('');
  const [mostrarErrores, setMostrarErrores] = useState(false);



  // Cargar los servicios y el usuario logueado al iniciar
  useEffect(() => {
    fetch('http://localhost:5000/api/servicios')
      .then(response => response.json())
      .then(data => {
        console.log("Servicios cargados en formulario:", data); // debug
        setServicios(data);
      })
      .catch(error => console.error("Error al obtener los servicios:", error));

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setDatos(prevDatos => ({
        ...prevDatos,
        nombre_cliente: usuario.nombre // Autorellenar el nombre
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMostrarErrores(true);

    if (name === 'hora') {
      const [h, m] = value.split(':').map(Number);
      const horaValida = h >= 9 && h <= 21;
    
      if (!horaValida) {
        setErrorHora("Selecciona una hora entre las 09:00 y las 21:00.");
      } else {
        setErrorHora('');
      }
    }
    
    if (name === 'fecha') {
      const seleccionada = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
  
      const mañana = new Date(hoy);
      mañana.setDate(hoy.getDate() + 1);
  
      const dia = seleccionada.getDay(); // 0 = domingo, 6 = sábado
  
      if (seleccionada < mañana) {
        setFechaValida(false);
        setErrorFecha("No puedes seleccionar una fecha anterior a mañana.");
      } else if (dia === 0 || dia === 6) {
        setFechaValida(false);
        setErrorFecha("No puedes seleccionar fines de semana (sábado o domingo).");
      } else {
        setFechaValida(true);
        setErrorFecha('');
      }
    }
  
    setDatos({ ...datos, [name]: value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMostrarErrores(true); // Activamos los mensajes de error visual

    if (errorFecha) {
      alert("Corrige los errores del formulario antes de continuar.");
      return;
    }
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      alert("Debes iniciar sesión o registrarte para reservar un servicio.");
      navigate('/auth'); // Redirige a la autenticación
      return;
    }

    
    if (!datos.nombre_cliente || !datos.servicio_id || !datos.fecha || !datos.hora) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const reservaData = {
      clienteOnline: { id: usuario.id },
      servicio: { id: parseInt(datos.servicio_id) },
      fechaYHora: `${datos.fecha}T${datos.hora}` // Formato ISO: yyyy-MM-ddTHH:mm
    };

    try {
      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
      });

      const result = await response.json();
      alert("Reserva realizada con éxito");
    } catch (error) {
      console.error("Error en la reserva:", error);
      alert("Hubo un problema al registrar la reserva.");
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
          disabled={!!JSON.parse(localStorage.getItem('usuario'))} // Solo editable si no está logueado
        />

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
  <label>Fecha *
    {errorFecha && <span className="inline-error">{errorFecha}</span>}
  </label>





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
  <label>Hora *
    {errorHora && <span className="inline-error">{errorHora}</span>}
  </label>
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



  <div>
  
  </div>  
  


</div>


        
   {!formularioValido && (
  <span className="error-text">
    Asegúrate de haber rellenado todos los campos correctamente.
  </span>
)}
        <button type="submit" disabled={!formularioValido}>Reservar</button>
      </form>
    </div>
  );
}; 

export default FormularioReserva;