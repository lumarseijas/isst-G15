package com.reserva.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_servicio", unique = true, nullable = false)
    private String nombreServicio;

    @Column(nullable = false)
    private int duracion; // en minutos

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio; // en euros

    @Column
    private String imagen; // URL de la imagen

    public Servicio() {}

    public Servicio(String nombreServicio, int duracion, BigDecimal precio, String imagen) {
        this.nombreServicio = nombreServicio;
        this.duracion = duracion;
        this.precio = precio;
        this.imagen = imagen;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }

    public int getDuracion() { return duracion; }
    public void setDuracion(int duracion) { this.duracion = duracion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}
