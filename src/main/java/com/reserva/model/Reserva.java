package com.reserva.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_online", referencedColumnName = "id", nullable = true)
    private Usuario clienteOnline; // Cliente online referenciado a la tabla usuarios

    @Column(name = "cliente_presencial")
    private String clientePresencial; // Si es cliente presencial, se guarda el nombre manualmente

    @Column(name = "num_tlfno")
    private String numTlfno; // Teléfono solo si es cliente presencial

    @ManyToOne
    @JoinColumn(name = "servicio_id", referencedColumnName = "id", nullable = false)
    private Servicio servicio; // Referencia a la tabla servicios

    @Column(name = "fecha_y_hora", nullable = false)
    private LocalDateTime fechaYHora; // Fecha y hora de la reserva

    @ManyToOne
    @JoinColumn(name = "trabajador_id")
    private Trabajador trabajador;

    public Reserva() {}

    public Reserva(Usuario clienteOnline, String clientePresencial, String numTlfno, Servicio servicio, LocalDateTime fechaYHora) {
        this.clienteOnline = clienteOnline;
        this.clientePresencial = clientePresencial;
        this.numTlfno = numTlfno;
        this.servicio = servicio;
        this.fechaYHora = fechaYHora;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getClienteOnline() { return clienteOnline; }
    public void setClienteOnline(Usuario clienteOnline) { this.clienteOnline = clienteOnline; }

    public String getClientePresencial() { return clientePresencial; }
    public void setClientePresencial(String clientePresencial) { this.clientePresencial = clientePresencial; }

    public String getNumTlfno() { return numTlfno; }
    public void setNumTlfno(String numTlfno) { this.numTlfno = numTlfno; }

    public Servicio getServicio() { return servicio; }
    public void setServicio(Servicio servicio) { this.servicio = servicio; }

    public LocalDateTime getFechaYHora() { return fechaYHora; }
    public void setFechaYHora(LocalDateTime fechaYHora) { this.fechaYHora = fechaYHora; }

    public Trabajador getTrabajador() { return trabajador; }
    public void setTrabajador(Trabajador trabajador) { this.trabajador = trabajador; }

}
