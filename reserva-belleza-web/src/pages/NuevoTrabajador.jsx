import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NuevoTrabajador = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/trabajadores", {
                nombre: formData.nombre,
                telefono: formData.telefono,
            });
            alert("Trabajador guardado con éxito");
            navigate("/admin");
        } catch (error) {
            console.error("Error al guardar el trabajador:", error);
            alert("Hubo un error al guardar el trabajador");
        }
    };



    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
            <h2>Añadir nuevo trabajador</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                <button type="submit" style={{ padding: "10px", fontWeight: "bold", backgroundColor: "#8A2BE2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default NuevoTrabajador;
