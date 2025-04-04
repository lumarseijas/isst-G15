import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NuevoServicio = () => {
    const [formData, setFormData] = useState({
        nombre_servicio: "",
        duracion: "",
        precio: "",
        imagen: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Enviando servicio:", {
                nombreServicio: formData.nombre_servicio,
                duracion: parseInt(formData.duracion),
                precio: parseFloat(formData.precio),
                imagen: formData.imagen || null
            });
            
            await axios.post("http://localhost:5000/api/servicios", {
                nombreServicio: formData.nombre_servicio,
                duracion: parseInt(formData.duracion),
                precio: parseFloat(formData.precio),
                imagen: formData.imagen || null
            });
            
            alert("Servicio guardado con éxito");
            navigate("/admin");
        } catch (error) {
            console.error("Error al guardar el servicio:", error);
            alert("Hubo un error al guardar el servicio");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
            <h2>Añadir nuevo servicio</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    name="nombre_servicio"
                    placeholder="Nombre del servicio"
                    value={formData.nombre_servicio}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="duracion"
                    placeholder="Duración (minutos)"
                    value={formData.duracion}
                    onChange={handleChange}
                    required
                    min="1"
                />
                <input
                    type="number"
                    name="precio"
                    step="0.01"
                    placeholder="Precio (€)"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                />
                <input
                    type="text"
                    name="imagen"
                    placeholder="URL de la imagen (opcional)"
                    value={formData.imagen}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        fontWeight: "bold",
                        backgroundColor: "#8A2BE2",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default NuevoServicio;
