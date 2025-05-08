import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const avataresDisponibles = [
  "/img/avatar1.png",
  "/img/avatar2.png",
  "/img/avatar3.png",
  "/img/avatar4.png"
];


const Perfil = () => {
  const navigate = useNavigate();
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");

  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    avatar: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usuario'));
    if (!storedUser || !storedUser.id) {
      navigate('/auth');
      return;
    }
  
    console.log("Usuario guardado:", storedUser);
  
    fetch(`http://localhost:5000/api/usuarios/${storedUser.id}`)
      .then(response => response.json())
      .then(data => {
        const usuarioFormateado = {
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          avatar: data.avatar || ''
        };
        setDatos(usuarioFormateado);
      })
      .catch(error => console.error("Error al cargar los datos del usuario:", error));
  }, [localStorage.getItem('usuario')]); // fuerza el efecto si cambia el usuario en localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value
    }));
  };
  

  const handleAvatarChange = (avatar) => {
    setDatos((prevDatos) => ({
      ...prevDatos,
      avatar: avatar // Actualiza solo el avatar
    }));
    console.log("Avatar seleccionado:", avatar); // Depuración
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${usuarioGuardado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Perfil actualizado correctamente");
        localStorage.setItem('usuario', JSON.stringify({
          ...usuarioGuardado,        
          ...datos                  
        }));
        navigate('/');
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al actualizar el perfil.");
    }
  };

  if (!datos.email) return <p>Cargando perfil...</p>;

  return (
    <div className="form-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre</label>
        <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={datos.email} onChange={handleChange} required disabled />

        <label>Teléfono</label>
        <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} />

        <label>Selecciona tu avatar</label>
        <div className="avatar-selection">
          {avataresDisponibles.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`avatar-option ${datos.avatar === avatar ? "selected" : ""}`} //aqui
              onClick={() => handleAvatarChange(avatar)}
            />
          ))}
        </div>
        <img src={datos.avatar} alt="Vista previa" className="avatar-preview" />

        <div className="formulario-cambiar-pass">
  <label>Cambiar contraseña</label>
  {/* CAMBIO DE CONTRASEÑA */}
<label style={{ marginTop: '20px' }}>Contraseña actual</label>
<input
  type="password"
  name="passwordActual"
  value={passActual}
  onChange={(e) => setPassActual(e.target.value)}
  className="input"
/>

<label style={{ marginTop: '10px' }}>Nueva contraseña</label>
<input
  type="password"
  name="passwordNueva"
  value={passNueva}
  onChange={(e) => setPassNueva(e.target.value)}
  className="input"
/>

<button
  type="button"
  style={{ marginTop: '15px', marginBottom: '20px' }}
  className="btn-editar"
  onClick={async () => {
    const email = JSON.parse(localStorage.getItem("usuario"))?.email;

    const response = await fetch("http://localhost:5000/api/usuarios/cambiar-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        actual: passActual,
        nueva: passNueva
      })
    });

    const msg = await response.text();
    if (response.ok) {
      alert(msg);
      setPassActual("");
      setPassNueva("");
    } else {
      alert("❌ " + msg);
    }
  }}
>
  Cambiar contraseña
</button>

</div>
<button type="submit">Actualizar</button>
<button type="button" className="btn-cancelar" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
};

export default Perfil;
