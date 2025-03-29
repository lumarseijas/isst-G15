package com.reserva.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime fechaYHora;

    @ManyToOne
    @JoinColumn(name = "cliente_online_id")
    @JsonIgnoreProperties({"reservas"})
    private Usuario clienteOnline;

    private String clientePresencial;
    private String numTlfno;

    @ManyToOne
    @JoinColumn(name = "trabajador_id")
    @JsonIgnoreProperties({"reservas"})
    private Trabajador trabajador;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    @JsonIgnoreProperties({"reservas"})
    private Servicio servicio;

    // === Getters y setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaYHora() {
        return fechaYHora;
    }

    public void setFechaYHora(LocalDateTime fechaYHora) {
        this.fechaYHora = fechaYHora;
    }

    public Usuario getClienteOnline() {
        return clienteOnline;
    }

    public void setClienteOnline(Usuario clienteOnline) {
        this.clienteOnline = clienteOnline;
    }

    public String getClientePresencial() {
        return clientePresencial;
    }

    public void setClientePresencial(String clientePresencial) {
        this.clientePresencial = clientePresencial;
    }

    public String getNumTlfno() {
        return numTlfno;
    }

    public void setNumTlfno(String numTlfno) {
        this.numTlfno = numTlfno;
    }

    public Trabajador getTrabajador() {
        return trabajador;
    }

    public void setTrabajador(Trabajador trabajador) {
        this.trabajador = trabajador;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }
}
