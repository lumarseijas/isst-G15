package com.reserva_belleza.model;

import jakarta.persistence.*;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre_servicio;
    private Double precio;
    private Integer duracion;

    public Servicio() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre_servicio() { return nombre_servicio; }
    public void setNombre_servicio(String nombre_servicio) { this.nombre_servicio = nombre_servicio; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getDuracion() { return duracion; }
    public void setDuracion(Integer duracion) { 
        this.duracion=duracion;
    }
}
