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
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    avatar: ''
  });

  // Cargar los datos del usuario
  useEffect(() => {
    if (!usuarioGuardado) {
      navigate('/auth');
      return;
    }

    console.log("Usuario guardado:", usuarioGuardado);  // para ver que id esta loggeado

    fetch(`http://localhost:5000/api/usuarios/${usuarioGuardado.id}`)
      .then(response => response.json())
      .then(data => setDatos(data))
      .catch(error => console.error("Error al cargar los datos del usuario:", error));
  }, [usuarioGuardado, navigate]);

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
        localStorage.setItem('usuario', JSON.stringify(datos)); // Guardar el nuevo avatar
        navigate('/');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al actualizar el perfil.");
    }
  };

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

        <button type="submit">Actualizar</button>
        <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
};

export default Perfil;
